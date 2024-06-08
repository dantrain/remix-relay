import {
  CollisionDetection,
  UniqueIdentifier,
  closestCenter,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
} from "@dnd-kit/core";
import exists from "server/lib/exists";

/**
 * Custom collision detection strategy optimized for multiple containers
 *
 * - First, find any droppable containers intersecting with the pointer.
 * - If there are none, find intersecting containers with the active draggable.
 * - If there are no intersecting containers, return the last matched intersection
 *
 */
export const getCollisionDetectionStrategy = (
  activeId: UniqueIdentifier | null,
  items: Record<UniqueIdentifier, UniqueIdentifier[]>,
  lastOverId: React.MutableRefObject<UniqueIdentifier | null>,
  recentlyMovedToNewContainer: React.MutableRefObject<boolean>,
): CollisionDetection => {
  return (args) => {
    if (activeId && activeId in items) {
      return closestCenter({
        ...args,
        droppableContainers: args.droppableContainers.filter(
          (container) => container.id in items,
        ),
      });
    }

    // Start by finding any intersecting droppable
    const pointerIntersections = pointerWithin(args);

    const intersections =
      pointerIntersections.length > 0
        ? // If there are droppables intersecting with the pointer, return those
          pointerIntersections
        : rectIntersection(args);

    let overId = getFirstCollision(intersections, "id");

    if (overId !== null) {
      if (overId in items) {
        const containerItems = exists(items[overId]);

        // If a container is matched and it contains items (columns 'A', 'B', 'C')
        if (containerItems.length > 0) {
          // Return the closest droppable within that container
          overId = exists(
            closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id),
              ),
            })[0]?.id,
          );
        }
      }

      lastOverId.current = overId;

      return [{ id: overId }];
    }

    // When a draggable item moves to a new container, the layout may shift
    // and the `overId` may become `null`. We manually set the cached `lastOverId`
    // to the id of the draggable item that was moved to the new container, otherwise
    // the previous `overId` will be returned which can cause items to incorrectly shift positions
    if (recentlyMovedToNewContainer.current) {
      lastOverId.current = activeId;
    }

    // If no droppable is matched, return the last match
    return lastOverId.current ? [{ id: lastOverId.current }] : [];
  };
};
