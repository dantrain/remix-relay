import {
  MouseSensor as BaseMouseSensor,
  CollisionDetection,
  DndContext,
  DragOverlay,
  DropAnimation,
  KeyboardSensor,
  MeasuringStrategy,
  TouchSensor,
  UniqueIdentifier,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toGlobalId } from "graphql-relay";
import exists from "lib/exists";
import { getNextRank, getRankBetween } from "lib/rank";
import { last, sortBy } from "lodash-es";
import {
  RefObject,
  createRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  ConnectionHandler,
  graphql,
  useFragment,
  useMutation,
} from "react-relay";
import { Transition, TransitionGroup } from "react-transition-group";
import { RecordSourceSelectorProxy } from "relay-runtime";
import {
  useIsClient,
  useIsomorphicLayoutEffect,
  useMediaQuery,
} from "usehooks-ts";
import { useSubscribe } from "~/hooks/useSubscribe";
import { getCollisionDetectionStrategy } from "~/lib/collision-detection-strategy";
import { coordinateGetter } from "~/lib/keyboard-coordinates";
import { Column } from "./Column";
import { CreateColumn } from "./CreateColumn";
import { DroppableColumn } from "./DroppableColumn";
import { Item } from "./Item";
import { SortableItem } from "./SortableItem";
import { BoardColumnRankMutation } from "./__generated__/BoardColumnRankMutation.graphql";
import { BoardFragment$key } from "./__generated__/BoardFragment.graphql";
import { BoardItemCreatedSubscription } from "./__generated__/BoardItemCreatedSubscription.graphql";
import { BoardItemDeletedSubscription } from "./__generated__/BoardItemDeletedSubscription.graphql";
import {
  BoardItemRankMutation,
  BoardItemRankMutation$data,
} from "./__generated__/BoardItemRankMutation.graphql";
import { ColumnFragment$key } from "./__generated__/ColumnFragment.graphql";
import { ItemFragment$key } from "./__generated__/ItemFragment.graphql";

const fragment = graphql`
  fragment BoardFragment on Board {
    id
    columnConnection {
      __id
      edges {
        node {
          id
          rank
          ...ColumnFragment
          itemConnection {
            __id
            edges {
              node {
                id
                rank
                ...ItemFragment
              }
            }
          }
        }
      }
    }
  }
`;

const columnCreatedSubscription = graphql`
  subscription BoardColumnCreatedSubscription($connections: [ID!]!) {
    columnCreated
      @appendNode(
        connections: $connections
        edgeTypeName: "BoardColumnConnectionEdge"
      ) {
      id
      ...ColumnFragment
    }
  }
`;

const columnDeletedSubscription = graphql`
  subscription BoardColumnDeletedSubscription($connections: [ID!]!) {
    columnDeleted {
      id @deleteEdge(connections: $connections)
    }
  }
`;

const itemCreatedSubscription = graphql`
  subscription BoardItemCreatedSubscription {
    itemCreated {
      id
      columnId
      ...ItemFragment
    }
  }
`;

const itemDeletedSubscription = graphql`
  subscription BoardItemDeletedSubscription($connections: [ID!]!) {
    itemDeleted {
      id @deleteEdge(connections: $connections)
    }
  }
`;

const columnRankMutation = graphql`
  mutation BoardColumnRankMutation($id: ID!, $rank: String) {
    updateOneColumn(id: $id, rank: $rank) {
      id
      rank
    }
  }
`;

const itemRankMutation = graphql`
  mutation BoardItemRankMutation($id: ID!, $rank: String!, $columnId: ID!) {
    updateOneItem(id: $id, rank: $rank, columnId: $columnId) {
      rank
      columnId
    }
  }
`;

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    className: { active: "invisible", dragOverlay: "dropping" },
  }),
};

type Columns = Record<
  UniqueIdentifier,
  {
    items: { id: UniqueIdentifier; rank: string; itemRef: ItemFragment$key }[];
    rank: string;
    itemConnectionId: string;
    columnRef: ColumnFragment$key;
  }
>;

type BoardProps = {
  boardRef: BoardFragment$key;
  scrollToRight: () => void;
};

export function Board({ boardRef, scrollToRight }: BoardProps) {
  const isClient = useIsClient();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { id: boardId, columnConnection } = useFragment(fragment, boardRef);

  useSubscribe({
    subscription: columnCreatedSubscription,
    variables: { connections: [columnConnection.__id] },
  });

  useSubscribe({
    subscription: columnDeletedSubscription,
    variables: { connections: [columnConnection.__id] },
  });

  useSubscribe<BoardItemCreatedSubscription>({
    subscription: itemCreatedSubscription,
    variables: {},
    updater: (store, data) => {
      const columnId = exists(data?.itemCreated.columnId);

      const itemRecord = store.getRootField("itemCreated");
      const connectionRecord = exists(
        store
          .get(toGlobalId("Column", columnId))
          ?.getLinkedRecord("itemConnection"),
      );

      ConnectionHandler.deleteNode(connectionRecord, itemRecord.getDataID());

      const edge = ConnectionHandler.createEdge(
        store,
        connectionRecord,
        itemRecord,
        "ColumnItemConnectionEdge",
      );

      ConnectionHandler.insertEdgeAfter(connectionRecord, edge);
    },
  });

  useSubscribe<BoardItemDeletedSubscription>({
    subscription: itemDeletedSubscription,
    variables: {
      connections: columnConnection.edges.map(
        ({ node }) => node.itemConnection.__id,
      ),
    },
  });

  const [commitColumnRank] =
    useMutation<BoardColumnRankMutation>(columnRankMutation);
  const [commitItemRank] = useMutation<BoardItemRankMutation>(itemRankMutation);

  const [columns, setColumns] = useState<Columns>(() =>
    sortBy(columnConnection.edges, "node.rank").reduce(
      (acc, { node }) => ({
        ...acc,
        [node.id]: {
          items: sortBy(node.itemConnection.edges, "node.rank").map(
            ({ node }) => ({ id: node.id, rank: node.rank, itemRef: node }),
          ),
          rank: node.rank,
          itemConnectionId: node.itemConnection.__id,
          columnRef: node,
        },
      }),
      {},
    ),
  );

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [draggedFromContainer, setDraggedFromContainer] =
    useState<UniqueIdentifier | null>(null);

  const containers = Object.keys(columns) as UniqueIdentifier[];

  useIsomorphicLayoutEffect(() => {
    const columns = sortBy(columnConnection.edges, "node.rank").reduce(
      (acc, { node }) => ({
        ...acc,
        [node.id]: {
          items: sortBy(node.itemConnection.edges, "node.rank").map(
            ({ node }) => ({ id: node.id, rank: node.rank, itemRef: node }),
          ),
          rank: node.rank,
          itemConnectionId: node.itemConnection.__id,
          columnRef: node,
        },
      }),
      {},
    );

    setColumns(columns);
  }, [columnConnection.edges, activeId]);

  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  const collisionDetectionStrategy: CollisionDetection = useMemo(
    () =>
      getCollisionDetectionStrategy(
        activeId,
        columns,
        lastOverId,
        recentlyMovedToNewContainer,
      ),
    [activeId, columns],
  );

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter }),
  );

  const onDragCancel = () => {
    setActiveId(null);
    setDraggedFromContainer(null);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [columns]);

  function renderSortableItemDragOverlay(id: UniqueIdentifier) {
    const { column, item } = exists(findItem(id, columns));
    return (
      <Item
        dragOverlay
        itemRef={item.itemRef}
        connectionId={column?.itemConnectionId}
      />
    );
  }

  function renderContainerDragOverlay(containerId: UniqueIdentifier) {
    const container = exists(columns[containerId]);
    return (
      <Column
        columnRef={container.columnRef}
        connectionId={columnConnection.__id}
      >
        {exists(container.items).map((item) => (
          <Item
            key={item.id}
            itemRef={item.itemRef}
            connectionId={container.itemConnectionId}
          />
        ))}
      </Column>
    );
  }

  const columnRefs = useRef<
    Record<UniqueIdentifier, RefObject<HTMLDivElement | null>>
  >({});

  const getColumnRef = (id: UniqueIdentifier) =>
    (columnRefs.current[id] ??= createRef<HTMLDivElement>());

  const isDraggingColumn = activeId && containers.includes(activeId);

  return (
    <DndContext
      autoScroll={{ interval: isDesktop ? Number.MIN_VALUE : 5 }}
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={({ active }) => {
        setActiveId(active.id);
        setDraggedFromContainer(findContainer(active.id, columns) ?? null);
      }}
      onDragOver={({ active, over }) => {
        const overId = over?.id;

        if (overId == null || active.id in columns) {
          return;
        }

        const overContainer = findContainer(overId, columns);
        const activeContainer = findContainer(active.id, columns);

        if (!overContainer || !activeContainer) {
          return;
        }

        if (activeContainer !== overContainer) {
          setColumns((columns) => {
            const activeItems = exists(columns[activeContainer]?.items);
            const overItems = exists(columns[overContainer]?.items);
            const overIndex = overItems.findIndex(({ id }) => id === overId);
            const activeIndex = activeItems.findIndex(
              ({ id }) => id === active.id,
            );

            let newIndex: number;

            if (overId in columns) {
              newIndex = overItems.length + 1;
            } else {
              const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top >
                  over.rect.top + over.rect.height;

              const modifier = isBelowOverItem ? 1 : 0;

              newIndex =
                overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            recentlyMovedToNewContainer.current = true;

            return {
              ...columns,
              [activeContainer]: {
                ...exists(columns[activeContainer]),
                items: exists(columns[activeContainer]?.items).filter(
                  (item) => item.id !== active.id,
                ),
              },
              [overContainer]: {
                ...exists(columns[overContainer]),
                items: [
                  ...exists(columns[overContainer]?.items).slice(0, newIndex),
                  ...(columns[activeContainer]?.items?.[activeIndex]
                    ? [exists(columns[activeContainer]?.items?.[activeIndex])]
                    : []),
                  ...exists(columns[overContainer]?.items).slice(
                    newIndex,
                    exists(columns[overContainer]?.items).length,
                  ),
                ],
              },
            };
          });
        }
      }}
      onDragEnd={({ active, over }) => {
        if (active.id in columns && over?.id) {
          const activeIndex = containers.indexOf(active.id);
          const overIndex = containers.indexOf(over.id);

          const reorderedContainers = arrayMove(
            containers,
            activeIndex,
            overIndex,
          );

          const beforeId = reorderedContainers[overIndex - 1];
          const afterId = reorderedContainers[overIndex + 1];

          const rank = getRankBetween(
            columns[beforeId ?? ""],
            columns[afterId ?? ""],
          );

          commitColumnRank({
            variables: { id: active.id.toString(), rank },
            optimisticResponse: {
              updateOneColumn: { id: active.id, rank },
            },
          });

          setActiveId(null);
          return;
        }

        const activeContainer = findContainer(active.id, columns);

        if (!activeContainer) {
          setActiveId(null);
          return;
        }

        const overId = over?.id;

        if (overId == null) {
          setActiveId(null);
          return;
        }

        const overContainer = findContainer(overId, columns);

        if (overContainer && draggedFromContainer) {
          const activeIndex = exists(columns[activeContainer]?.items).findIndex(
            ({ id }) => id === active.id,
          );

          const overIndex = exists(columns[overContainer]?.items).findIndex(
            ({ id }) => id === overId,
          );

          const items = exists(columns[overContainer]).items;

          const reorderedItems = arrayMove(items, activeIndex, overIndex);

          const beforeItem = reorderedItems[overIndex - 1];
          const afterItem = reorderedItems[overIndex + 1];

          const rank =
            beforeItem || afterItem
              ? getRankBetween(beforeItem, afterItem)
              : getNextRank();

          const updater = (
            store: RecordSourceSelectorProxy<BoardItemRankMutation$data>,
          ) => {
            if (draggedFromContainer !== overContainer) {
              const payload = store.getRootField("updateOneItem");

              const prevConnectionRecord = exists(
                store.get(
                  exists(columns[draggedFromContainer]?.itemConnectionId),
                ),
              );

              const nextConnectionRecord = exists(
                store.get(exists(columns[overContainer]?.itemConnectionId)),
              );

              const edge = ConnectionHandler.createEdge(
                store,
                nextConnectionRecord,
                payload,
                "ColumnItemConnectionEdge",
              );

              ConnectionHandler.insertEdgeAfter(nextConnectionRecord, edge);

              ConnectionHandler.deleteNode(
                prevConnectionRecord,
                active.id.toString(),
              );
            }
          };

          commitItemRank({
            variables: {
              id: active.id.toString(),
              columnId: overContainer.toString(),
              rank,
            },
            optimisticResponse: {
              updateOneItem: {
                id: active.id.toString(),
                columnId: overContainer.toString(),
                rank,
              },
            },
            optimisticUpdater: updater,
            updater,
          });
        }

        setActiveId(null);
      }}
      onDragCancel={onDragCancel}
    >
      <div className="flex min-h-0 w-fit flex-1 flex-col items-start">
        <div
          className="grid min-h-0 grid-flow-col gap-3 p-2
            pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:p-4 sm:pt-2"
        >
          <SortableContext
            items={[...containers]}
            strategy={horizontalListSortingStrategy}
          >
            <TransitionGroup component={null}>
              {containers.map((containerId) => {
                const container = exists(columns[containerId]);
                return (
                  <Transition
                    key={containerId}
                    nodeRef={getColumnRef(containerId)}
                    timeout={{ exit: 200 }}
                  >
                    {(state) => (
                      <DroppableColumn
                        id={containerId}
                        ref={getColumnRef(containerId)}
                        items={container.items}
                        columnRef={container.columnRef}
                        connectionId={columnConnection.__id}
                        hidden={state === "exiting"}
                      >
                        <SortableContext
                          items={container.items}
                          strategy={verticalListSortingStrategy}
                        >
                          {container.items.map((item) => {
                            return (
                              <SortableItem
                                key={item.id}
                                id={item.id}
                                recentlyMovedToNewContainer={
                                  recentlyMovedToNewContainer
                                }
                                itemRef={item.itemRef}
                                connectionId={container.itemConnectionId}
                              />
                            );
                          })}
                        </SortableContext>
                      </DroppableColumn>
                    )}
                  </Transition>
                );
              })}
            </TransitionGroup>
          </SortableContext>
          <CreateColumn
            connectionId={columnConnection.__id}
            boardId={boardId}
            lastColumn={last(columnConnection.edges)?.node}
            scrollToRight={scrollToRight}
          />
        </div>
      </div>
      {isClient
        ? createPortal(
            <DragOverlay
              dropAnimation={dropAnimation}
              modifiers={isDraggingColumn ? [restrictToHorizontalAxis] : []}
            >
              {activeId
                ? isDraggingColumn
                  ? renderContainerDragOverlay(activeId)
                  : renderSortableItemDragOverlay(activeId)
                : null}
            </DragOverlay>,
            document.body,
          )
        : null}
    </DndContext>
  );
}

class MouseSensor extends BaseMouseSensor {
  static activators = [
    {
      eventName: "onMouseDown" as const,
      handler: ({ nativeEvent }: React.MouseEvent) => {
        // Only activate if the left mouse button is pressed
        return nativeEvent.button === 0;
      },
    },
  ];
}

function findItem(id: UniqueIdentifier, columns: Columns) {
  for (const key in columns) {
    const item = exists(columns[key]?.items).find((item) => item.id === id);
    if (item) return { column: exists(columns[key]), item };
  }
}

function findContainer(id: UniqueIdentifier, columns: Columns) {
  if (id in columns) {
    return id;
  }

  return Object.keys(columns).find((key) =>
    exists(columns[key]?.items).some((item) => item.id === id),
  );
}
