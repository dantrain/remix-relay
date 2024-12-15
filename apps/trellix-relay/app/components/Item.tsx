import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { cva, cx } from "class-variance-authority";
import { toGlobalId } from "graphql-relay";
import exists from "lib/exists";
import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import {
  CSSProperties,
  FormEvent,
  memo,
  Ref,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFocusVisible } from "react-aria";
import {
  ConnectionHandler,
  graphql,
  useFragment,
  useMutation,
} from "react-relay";
import invariant from "tiny-invariant";
import { Button } from "@remix-relay/ui";
import { useSubscribe } from "~/hooks/useSubscribe";
import { DropdownMenuContent, DropdownMenuItem } from "./DropdownMenu";
import { ItemDeleteOneItemMutation } from "./__generated__/ItemDeleteOneItemMutation.graphql";
import { ItemFragment$key } from "./__generated__/ItemFragment.graphql";
import { ItemSubscription } from "./__generated__/ItemSubscription.graphql";
import { ItemUpdateOneItemMutation } from "./__generated__/ItemUpdateOneItemMutation.graphql";

const fragment = graphql`
  fragment ItemFragment on Item {
    id
    title
    rank
    columnId
  }
`;

const subscription = graphql`
  subscription ItemSubscription($id: ID!) {
    item(id: $id) {
      rank
      columnId
      ...ItemFragment
    }
  }
`;

const updateOneItemMutation = graphql`
  mutation ItemUpdateOneItemMutation($id: ID!, $title: String) {
    updateOneItem(id: $id, title: $title) {
      id
      title
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
  ref?: Ref<HTMLLIElement>;
};

export const Item = memo(
  ({
    dataRef,
    connectionId,
    dragOverlay = false,
    dragging,
    listeners,
    transition,
    transform,
    ref,
    ...props
  }: ItemProps) => {
    const { id, title, columnId } = useFragment(fragment, dataRef);

    useSubscribe<ItemSubscription>({
      subscription,
      variables: { id },
      updater: (store, data) => {
        invariant(columnId, "Missing prev columnId");
        invariant(data?.item.columnId, "Missing next columnId");

        if (data.item.columnId !== columnId) {
          const itemRecord = store.getRootField("item");

          const prevConnectionRecord = exists(
            store
              .get(toGlobalId("Column", columnId))
              ?.getLinkedRecord("itemConnection"),
          );

          const nextConnectionRecord = exists(
            store
              .get(toGlobalId("Column", data.item.columnId))
              ?.getLinkedRecord("itemConnection"),
          );

          const edge = ConnectionHandler.createEdge(
            store,
            nextConnectionRecord,
            itemRecord,
            "ColumnItemConnectionEdge",
          );

          ConnectionHandler.insertEdgeAfter(nextConnectionRecord, edge);

          ConnectionHandler.deleteNode(prevConnectionRecord, id);
        }
      },
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      if (!dragOverlay || isFocusVisible) {
        return;
      }

      document.body.style.cursor = "grabbing";

      return () => {
        document.body.style.cursor = "";
      };
    }, [dragOverlay, isFocusVisible]);

    const deleteItem = () => {
      commitDelete({
        variables: { id, connections: [connectionId] },
        optimisticResponse: { deleteOneItem: { id } },
      });
    };

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();

      const formData = new FormData(e.target as HTMLFormElement);
      const newTitle = (formData.get("title") as string).trim();

      if (newTitle && newTitle !== title) {
        commitUpdate({
          variables: { id, title: newTitle },
          optimisticResponse: { updateOneItem: { id, title: newTitle } },
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
            "--scale-x": transform?.scaleX ? `${transform.scaleX}` : undefined,
            "--scale-y": transform?.scaleY ? `${transform.scaleY}` : undefined,
          } as CSSProperties
        }
        ref={ref}
      >
        <div
          className={cva(
            `item group flex flex-grow touch-manipulation select-none
            items-start rounded-md border pr-1 outline-none sm:pr-2`,
            {
              variants: {
                dragging: { true: "invisible" },
                dragOverlay: {
                  true: "cursor-[inherit]",
                  false: "cursor-default shadow-sm",
                },
                isFocusVisible: { true: "ring-sky-500" },
                isEditing: {
                  true: "border-[#afbccc] bg-slate-300",
                  false: "gap-2 border-slate-200 bg-white",
                },
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
          {...(isEditing || isMenuOpen ? [] : listeners)}
          {...props}
          role="button"
          tabIndex={0}
        >
          {isEditing ? (
            <form
              className="flex-1 p-1 pr-0"
              ref={formRef}
              onSubmit={handleSubmit}
              onBlur={() => formRef.current?.requestSubmit()}
            >
              <label className="sr-only" htmlFor="editItemInput-title">
                Title
              </label>
              <TextareaAutosize
                id="editItemInput-title"
                ref={textAreaRef}
                name="title"
                className="block w-full resize-none rounded-[4px] border-none
                  bg-white px-2 py-1 shadow-[inset_0_0_0_1px] shadow-slate-500
                  focus:ring-0"
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
                defaultValue={title}
              />
            </form>
          ) : (
            <div className="flex-1 self-center py-2 pl-3">{title}</div>
          )}
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                className={cx(
                  `relative mt-1 p-2 group-hover:opacity-100
                  data-[state=open]:bg-slate-300 data-[state=open]:opacity-100
                  sm:mt-2 sm:p-1 sm:opacity-0`,
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
                  onPress={() => {
                    setIsEditing(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <PencilIcon className="mr-2 w-4" />
                  Edit
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button className="w-full" variant="ghost" onPress={deleteItem}>
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
);

Item.displayName = "Item";
