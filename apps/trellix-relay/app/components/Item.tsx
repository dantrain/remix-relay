import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { cva, cx } from "class-variance-authority";
import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import {
  CSSProperties,
  FormEvent,
  forwardRef,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFocusVisible } from "react-aria";
import { graphql, useFragment, useMutation } from "react-relay";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@remix-relay/ui";
import { useSubscribe } from "~/hooks/useSubscribe";
import { DropdownMenuContent, DropdownMenuItem } from "./DropdownMenu";
import { ItemDeleteOneItemMutation } from "./__generated__/ItemDeleteOneItemMutation.graphql";
import { ItemFragment$key } from "./__generated__/ItemFragment.graphql";
import { ItemUpdateOneItemMutation } from "./__generated__/ItemUpdateOneItemMutation.graphql";

const fragment = graphql`
  fragment ItemFragment on Item {
    id
    text
  }
`;

const subscription = graphql`
  subscription ItemSubscription($id: ID!) {
    item(id: $id) {
      ...ItemFragment
    }
  }
`;

const updateOneItemMutation = graphql`
  mutation ItemUpdateOneItemMutation($id: ID!, $text: String) {
    updateOneItem(id: $id, text: $text) {
      id
      text
    }
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

      useSubscribe({ subscription, variables: { id } });

      const [isEditing, setIsEditing] = useState(false);

      const textAreaRef = useRef<HTMLTextAreaElement>(null);
      const formRef = useRef<HTMLFormElement>(null);

      const [commitUpdate] = useMutation<ItemUpdateOneItemMutation>(
        updateOneItemMutation,
      );

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

      const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const newText = (formData.get("title") as string).trim();

        if (newText && newText !== text) {
          commitUpdate({
            variables: { id, text: newText },
            optimisticResponse: { updateOneItem: { id, text: newText } },
          });
        }

        setIsEditing(false);
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
              rounded-md border border-slate-200 bg-white pr-2 outline-none`,
              {
                variants: {
                  dragging: { true: "invisible" },
                  dragOverlay: {
                    true: "cursor-[inherit]",
                    false: "cursor-default shadow-sm",
                  },
                  isFocusVisible: { true: "ring-sky-500" },
                  isEditing: { true: "border-slate-500" },
                },
                compoundVariants: [
                  {
                    dragOverlay: false,
                    isEditing: false,
                    className: "cursor-grab",
                  },
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
            )({ dragging, dragOverlay, isFocusVisible, isEditing })}
            style={{ WebkitTapHighlightColor: "transparent" } as CSSProperties}
            {...(isEditing ? [] : listeners)}
            {...props}
            role="button"
            tabIndex={0}
          >
            {isEditing ? (
              <form
                className="flex-1"
                ref={formRef}
                onSubmit={handleSubmit}
                onBlur={() => formRef.current?.requestSubmit()}
              >
                <label className="sr-only" htmlFor="editItemInput-text">
                  Title
                </label>
                <TextareaAutosize
                  id="editItemInput-text"
                  ref={textAreaRef}
                  name="title"
                  className="block w-full resize-none rounded-md border-none p-0
                    py-2 pl-3 focus:ring-0"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      formRef.current?.requestSubmit();
                    }
                    if (event.key === "Escape") {
                      setIsEditing(false);
                    }
                  }}
                  placeholder="Enter a title"
                  autoComplete="off"
                  defaultValue={text}
                />
              </form>
            ) : (
              <div className="flex-1 self-center py-2 pl-3">{text}</div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={cx(
                    `relative mt-2 p-2 group-hover:opacity-100
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
              <DropdownMenuContent
                align="end"
                onCloseAutoFocus={(e) => {
                  if (isEditing) {
                    e.preventDefault();
                    const textarea = textAreaRef.current;

                    if (textarea) {
                      const len = textarea.value.length;
                      textarea.focus();
                      textarea.setSelectionRange(len, len);
                    }
                  }
                }}
              >
                <DropdownMenuItem asChild>
                  <Button
                    className="w-full"
                    variant="ghost"
                    onPress={() => setIsEditing(true)}
                  >
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
