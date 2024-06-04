import type { Board } from "./Board";
import type { User } from "./User";

export { boards } from "./Board";
export { users } from "./User";

export type Objects = {
  Board: Board;
  User: User;
};
