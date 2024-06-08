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
import { range } from "lodash-es";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal, unstable_batchedUpdates } from "react-dom";
import exists from "server/lib/exists";
import { useIsClient } from "usehooks-ts";
import { coordinateGetter } from "~/lib/keyboard-coordinates";
import { getCollisionDetectionStrategy } from "../../lib/collision-detection-strategy";
import { Container } from "../Container/Container";
import { Item } from "../Item/Item";
import { DroppableContainer } from "./DroppableContainer";
import { SortableItem } from "./SortableItem";

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        visibility: "hidden",
      },
    },
  }),
};

export type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;

const PLACEHOLDER_ID = "placeholder";
const empty: UniqueIdentifier[] = [];

export function MultipleContainers() {
  const isClient = useIsClient();

  const [items, setItems] = useState<Items>(() => ({
    A: range(3).map((index) => `A${index + 1}`),
    B: range(3).map((index) => `B${index + 1}`),
    C: range(3).map((index) => `C${index + 1}`),
    D: range(3).map((index) => `D${index + 1}`),
  }));

  const [containers, setContainers] = useState(
    Object.keys(items) as UniqueIdentifier[],
  );

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const isSortingContainer = activeId ? containers.includes(activeId) : false;

  const collisionDetectionStrategy: CollisionDetection = useMemo(
    () =>
      getCollisionDetectionStrategy(
        activeId,
        items,
        lastOverId,
        recentlyMovedToNewContainer,
      ),
    [activeId, items],
  );

  const [clonedItems, setClonedItems] = useState<Items | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter }),
  );

  const onDragCancel = () => {
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  function renderSortableItemDragOverlay(id: UniqueIdentifier) {
    return <Item dragOverlay>{id}</Item>;
  }

  function renderContainerDragOverlay(containerId: UniqueIdentifier) {
    return (
      <Container
        label={`Column ${containerId}`}
        style={{
          height: "100%",
        }}
        shadow
      >
        {exists(items[containerId]).map((item) => (
          <Item key={item}>{item}</Item>
        ))}
      </Container>
    );
  }

  function handleRemove(containerID: UniqueIdentifier) {
    setContainers((containers) =>
      containers.filter((id) => id !== containerID),
    );
  }

  function handleAddColumn() {
    const newContainerId = getNextContainerId();

    unstable_batchedUpdates(() => {
      setContainers((containers) => [...containers, newContainerId]);
      setItems((items) => ({
        ...items,
        [newContainerId]: [],
      }));
    });
  }

  function getNextContainerId() {
    const containerIds = Object.keys(items);
    const lastContainerId = containerIds[containerIds.length - 1];

    return String.fromCharCode(exists(lastContainerId).charCodeAt(0) + 1);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={({ active }) => {
        setActiveId(active.id);
        setClonedItems(items);
      }}
      onDragOver={({ active, over }) => {
        const overId = over?.id;

        if (overId == null || active.id in items) {
          return;
        }

        const overContainer = findContainer(overId, items);
        const activeContainer = findContainer(active.id, items);

        if (!overContainer || !activeContainer) {
          return;
        }

        if (activeContainer !== overContainer) {
          setItems((items) => {
            const activeItems = exists(items[activeContainer]);
            const overItems = exists(items[overContainer]);
            const overIndex = overItems.indexOf(overId);
            const activeIndex = activeItems.indexOf(active.id);

            let newIndex: number;

            if (overId in items) {
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
              ...items,
              [activeContainer]: exists(items[activeContainer]).filter(
                (item) => item !== active.id,
              ),
              [overContainer]: [
                ...exists(items[overContainer]).slice(0, newIndex),
                exists(items[activeContainer]?.[activeIndex]),
                ...exists(items[overContainer]).slice(
                  newIndex,
                  exists(items[overContainer]).length,
                ),
              ],
            };
          });
        }
      }}
      onDragEnd={({ active, over }) => {
        if (active.id in items && over?.id) {
          setContainers((containers) => {
            const activeIndex = containers.indexOf(active.id);
            const overIndex = containers.indexOf(over.id);

            return arrayMove(containers, activeIndex, overIndex);
          });
        }

        const activeContainer = findContainer(active.id, items);

        if (!activeContainer) {
          setActiveId(null);
          return;
        }

        const overId = over?.id;

        if (overId == null) {
          setActiveId(null);
          return;
        }

        if (overId === PLACEHOLDER_ID) {
          const newContainerId = getNextContainerId();

          unstable_batchedUpdates(() => {
            setContainers((containers) => [...containers, newContainerId]);
            setItems((items) => ({
              ...items,
              [activeContainer]: exists(items[activeContainer]).filter(
                (id) => id !== activeId,
              ),
              [newContainerId]: [active.id],
            }));
            setActiveId(null);
          });

          return;
        }

        const overContainer = findContainer(overId, items);

        if (overContainer) {
          const activeIndex = exists(items[activeContainer]).indexOf(active.id);
          const overIndex = exists(items[overContainer]).indexOf(overId);

          if (activeIndex !== overIndex) {
            setItems((items) => ({
              ...items,
              [overContainer]: arrayMove(
                exists(items[overContainer]),
                activeIndex,
                overIndex,
              ),
            }));
          }
        }

        setActiveId(null);
      }}
      onDragCancel={onDragCancel}
    >
      <div className="inline-grid grid-flow-col">
        <SortableContext
          items={[...containers, PLACEHOLDER_ID]}
          strategy={horizontalListSortingStrategy}
        >
          {containers.map((containerId) => (
            <DroppableContainer
              key={containerId}
              id={containerId}
              label={`Column ${containerId}`}
              items={exists(items[containerId])}
              onRemove={() => handleRemove(containerId)}
            >
              <SortableContext
                items={exists(items[containerId])}
                strategy={verticalListSortingStrategy}
              >
                {exists(items[containerId]).map((value, index) => {
                  return (
                    <SortableItem
                      disabled={isSortingContainer}
                      key={value}
                      id={value}
                      index={index}
                      containerId={containerId}
                    />
                  );
                })}
              </SortableContext>
            </DroppableContainer>
          ))}
          <DroppableContainer
            id={PLACEHOLDER_ID}
            disabled={isSortingContainer}
            items={empty}
            onClick={handleAddColumn}
            placeholder
          >
            + Add column
          </DroppableContainer>
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

function findContainer(id: UniqueIdentifier, items: Items) {
  if (id in items) {
    return id;
  }

  return Object.keys(items).find((key) => exists(items[key]).includes(id));
}
