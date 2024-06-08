import type { Board } from "./Board";
import type { Column } from "./Column";
import type { User } from "./User";

export { boards } from "./Board";
export { columns } from "./Column";
export { users } from "./User";

export type Objects = {
  Board: Board;
  Column: Column;
  User: User;
};
