import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { cva, cx } from "class-variance-authority";
import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { CSSProperties, forwardRef, memo, useEffect } from "react";
import { useFocusVisible } from "react-aria";
import { graphql, useFragment, useMutation } from "react-relay";
import { Button } from "@remix-relay/ui";
import { DropdownMenuContent, DropdownMenuItem } from "./DropdownMenu";
import { ItemDeleteOneItemMutation } from "./__generated__/ItemDeleteOneItemMutation.graphql";
import { ItemFragment$key } from "./__generated__/ItemFragment.graphql";

const fragment = graphql`
  fragment ItemFragment on Item {
    id
    text
  }
`;

const deleteOneItemMutation = graphql`
  mutation ItemDeleteOneItemMutation($id: ID!, $connections: [ID!]!) {
    deleteOneItem(id: $id) {
      id @deleteEdge(connections: $connections)
    }
  }
`;

export type ItemProps = {
  dataRef: ItemFragment$key;
  connectionId: string;
  dragOverlay?: boolean;
  dragging?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  transition?: string | null;
};

export const Item = memo(
  forwardRef<HTMLLIElement, ItemProps>(
    (
      {
        dataRef,
        connectionId,
        dragOverlay = false,
        dragging,
        listeners,
        transition,
        transform,
        ...props
      },
      ref,
    ) => {
      const { id, text } = useFragment(fragment, dataRef);

      const [commitDelete] = useMutation<ItemDeleteOneItemMutation>(
        deleteOneItemMutation,
      );

      const { isFocusVisible } = useFocusVisible({ isTextInput: true });

      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = "grabbing";

        return () => {
          document.body.style.cursor = "";
        };
      }, [dragOverlay]);

      const deleteItem = () => {
        commitDelete({
          variables: { id, connections: [connectionId] },
          optimisticResponse: { deleteOneItem: { id } },
        });
      };

      return (
        <li
          className={cx("flex touch-manipulation", dragOverlay && "z-50")}
          style={
            {
              transform:
                "translate3d(var(--translate-x, 0), var(--translate-y, 0), 0) scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1))",
              transition,
              "--translate-x": transform
                ? `${Math.round(transform.x)}px`
                : undefined,
              "--translate-y": transform
                ? `${Math.round(transform.y)}px`
                : undefined,
              "--scale-x": transform?.scaleX
                ? `${transform.scaleX}`
                : undefined,
              "--scale-y": transform?.scaleY
                ? `${transform.scaleY}`
                : undefined,
            } as CSSProperties
          }
          ref={ref}
        >
          <div
            className={cva(
              `group flex flex-grow touch-manipulation items-start gap-2
              rounded-md border border-slate-200 bg-white py-2 pl-3 pr-2
              outline-none`,
              {
                variants: {
                  dragging: { true: "invisible" },
                  dragOverlay: {
                    true: "cursor-[inherit]",
                    false: "cursor-grab shadow-sm",
                  },
                  isFocusVisible: { true: "ring-sky-500" },
                },
                compoundVariants: [
                  {
                    isFocusVisible: false,
                    dragOverlay: true,
                    className: "shadow-md",
                  },
                  {
                    isFocusVisible: true,
                    dragOverlay: false,
                    className: "ring-inset focus:ring-2",
                  },
                  {
                    isFocusVisible: true,
                    dragOverlay: true,
                    className: "shadow-lg ring-4",
                  },
                ],
              },
            )({ dragging, dragOverlay, isFocusVisible })}
            style={{ WebkitTapHighlightColor: "transparent" } as CSSProperties}
            {...listeners}
            {...props}
            role="button"
            tabIndex={0}
          >
            <span className="flex-1 self-center">{text}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={cx(
                    `relative p-2 group-hover:opacity-100
                    data-[state=open]:bg-slate-300 data-[state=open]:opacity-100
                    sm:p-1 sm:opacity-0`,
                    isFocusVisible && "focus:opacity-100",
                  )}
                  variant="ghost"
                >
                  <EllipsisVerticalIcon className="not-sr-only w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Button className="w-full" variant="ghost">
                    <PencilIcon className="mr-2 w-4" />
                    Edit
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Button
                    className="w-full"
                    variant="ghost"
                    onPress={deleteItem}
                  >
                    <Trash2Icon className="mr-2 w-4" />
                    Delete
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </li>
      );
    },
  ),
);
