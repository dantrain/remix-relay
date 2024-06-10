import {
  CollisionDetection,
  DndContext,
  DragOverlay,
  DropAnimation,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import exists from "lib/exists";
import { getRankBetween } from "lib/rank";
import { last, range, sortBy } from "lodash-es";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { graphql, useFragment, useMutation } from "react-relay";
import { useIsClient } from "usehooks-ts";
import { getCollisionDetectionStrategy } from "~/lib/collision-detection-strategy";
import { coordinateGetter } from "~/lib/keyboard-coordinates";
import { Column } from "./Column";
import { CreateColumn } from "./CreateColumn";
import { DroppableColumn } from "./DroppableColumn";
import { Item } from "./Item";
import { PlaceholderColumn } from "./PlaceholderColumn";
import { SortableItem } from "./SortableItem";
import { BoardColumnRankMutation } from "./__generated__/BoardColumnRankMutation.graphql";
import { BoardFragment$key } from "./__generated__/BoardFragment.graphql";
import { BoardItemRankMutation } from "./__generated__/BoardItemRankMutation.graphql";
import { ColumnFragment$key } from "./__generated__/ColumnFragment.graphql";

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
            edges {
              node {
                id
                text
                rank
              }
            }
          }
        }
      }
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
      id
      rank
    }
  }
`;

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        visibility: "hidden",
      },
    },
  }),
};

type Columns = Record<
  UniqueIdentifier,
  {
    items: { id: UniqueIdentifier; rank: string }[];
    rank: string;
    dataRef: ColumnFragment$key;
  }
>;

const PLACEHOLDER_ID = "placeholder";

type BoardProps = {
  dataRef: BoardFragment$key;
};

export function Board({ dataRef }: BoardProps) {
  const isClient = useIsClient();

  const { id: boardId, columnConnection } = useFragment(fragment, dataRef);

  const [commitColumnRank] =
    useMutation<BoardColumnRankMutation>(columnRankMutation);
  const [commitItemRank] = useMutation<BoardItemRankMutation>(itemRankMutation);

  const columns: Columns = useMemo(
    () =>
      sortBy(columnConnection.edges, "node.rank").reduce(
        (acc, { node }) => ({
          ...acc,
          [node.id]: {
            items: sortBy(node.itemConnection.edges, "node.rank").map(
              ({ node }) => ({ id: node.id, rank: node.rank }),
            ),
            dataRef: node,
            rank: node.rank,
          },
        }),
        {},
      ),
    [columnConnection.edges],
  );

  const [, setColumns] = useState<Columns>(() =>
    sortBy(columnConnection.edges, "node.rank").reduce(
      (acc, { node }) => ({
        ...acc,
        [node.id]: {
          items: range(3).map((index) => `${node.id}-${index + 1}`),
          dataRef: node,
          rank: node.rank,
        },
      }),
      {},
    ),
  );

  const containers = Object.keys(columns) as UniqueIdentifier[];

  // useEffect(() => {
  //   const columns = sortBy(columnConnection.edges, "node.rank").reduce(
  //     (acc, { node }) => ({
  //       ...acc,
  //       [node.id]: {
  //         items: range(3).map((index) => `${node.title}-${index + 1}`),
  //         dataRef: node,
  //         rank: node.rank,
  //       },
  //     }),
  //     {},
  //   );

  //   setColumns(columns);
  // }, [columnConnection.edges]);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  // const isSortingContainer = activeId ? containers.includes(activeId) : false;

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

  const [clonedColumns, setClonedColumns] = useState<Columns | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter }),
  );

  const onDragCancel = () => {
    if (clonedColumns) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setColumns(clonedColumns);
    }

    setActiveId(null);
    setClonedColumns(null);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [columns]);

  function renderSortableItemDragOverlay(id: UniqueIdentifier) {
    return <Item dragOverlay>{id}</Item>;
  }

  function renderContainerDragOverlay(containerId: UniqueIdentifier) {
    return (
      <Column
        dataRef={exists(columns[containerId]?.dataRef)}
        connectionId={columnConnection.__id}
        style={{
          height: "100%",
        }}
        shadow
      >
        {exists(columns[containerId]?.items).map((item) => (
          <Item key={item.id}>{item.id.toString().substring(0, 8)}</Item>
        ))}
      </Column>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={({ active }) => {
        setActiveId(active.id);
        setClonedColumns(columns);
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
          console.log("Drop on different container");

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
                  exists(columns[activeContainer]?.items?.[activeIndex]),
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

        // New column when dropped

        // if (overId === PLACEHOLDER_ID) {
        //   const newContainerId = getNextContainerId();

        //   unstable_batchedUpdates(() => {
        //     setContainers((containers) => [...containers, newContainerId]);
        //     setColumns((columns) => ({
        //       ...columns,
        //       [activeContainer]: {
        //         items: exists(columns[activeContainer]).items.filter(
        //           (id) => id !== activeId,
        //         ),
        //       },
        //       [newContainerId]: { items: [active.id] },
        //     }));
        //     setActiveId(null);
        //   });

        //   return;
        // }

        const overContainer = findContainer(overId, columns);

        if (overContainer) {
          const activeIndex = exists(columns[activeContainer]?.items).findIndex(
            ({ id }) => id === active.id,
          );
          const overIndex = exists(columns[overContainer]?.items).findIndex(
            ({ id }) => id === overId,
          );

          if (activeIndex !== overIndex) {
            const reorderedItems = arrayMove(
              exists(columns[overContainer]?.items),
              activeIndex,
              overIndex,
            );

            const beforeItem = reorderedItems[overIndex - 1];
            const afterItem = reorderedItems[overIndex + 1];

            const rank = getRankBetween(beforeItem, afterItem);

            commitItemRank({
              variables: {
                id: active.id.toString(),
                columnId: overContainer.toString(),
                rank,
              },
              optimisticResponse: {
                updateOneItem: {
                  id: active.id.toString(),
                  rank,
                },
              },
            });
          }
        }

        setActiveId(null);
      }}
      onDragCancel={onDragCancel}
    >
      <div className="inline-grid grid-flow-col gap-3">
        <SortableContext
          items={[...containers, PLACEHOLDER_ID]}
          strategy={horizontalListSortingStrategy}
        >
          {containers.map((containerId) => (
            <DroppableColumn
              key={containerId}
              id={containerId}
              items={exists(columns[containerId]).items}
              dataRef={exists(columns[containerId]).dataRef}
              connectionId={columnConnection.__id}
            >
              <SortableContext
                items={exists(columns[containerId]).items}
                strategy={verticalListSortingStrategy}
              >
                {exists(columns[containerId]?.items).map((item) => {
                  return (
                    <SortableItem
                      key={item.id}
                      id={item.id}
                      containerId={containerId}
                    >
                      {item.id.toString().substring(0, 8)}
                    </SortableItem>
                  );
                })}
              </SortableContext>
            </DroppableColumn>
          ))}
          <PlaceholderColumn id={PLACEHOLDER_ID}>
            <CreateColumn
              connectionId={columnConnection.__id}
              boardId={boardId}
              lastColumn={last(columnConnection.edges)?.node}
            />
          </PlaceholderColumn>
        </SortableContext>
      </div>
      {isClient
        ? createPortal(
            <DragOverlay dropAnimation={dropAnimation}>
              {activeId
                ? containers.includes(activeId)
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

function findContainer(id: UniqueIdentifier, items: Columns) {
  if (id in items) {
    return id;
  }

  return Object.keys(items).find((key) =>
    exists(items[key]?.items).some((item) => item.id === id),
  );
}
