import type { Board } from "./Board";
import type { Column } from "./Column";
import type { User } from "./User";

export { boards, boardRelations } from "./Board";
export { columns, columnRelations } from "./Column";
export { users, usersRelations } from "./User";

export type Objects = {
  Board: Board;
  Column: Column;
  User: User;
};
