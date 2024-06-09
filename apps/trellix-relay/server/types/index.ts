import type { Board } from "./Board";
import type { Column } from "./Column";
import type { Item } from "./Item";
import type { User } from "./User";

export { boards, boardRelations } from "./Board";
export { columns, columnRelations } from "./Column";
export { items, itemRelations } from "./Item";
export { users, usersRelations } from "./User";

export type Objects = {
  Board: Board;
  Column: Column;
  Item: Item;
  User: User;
};
