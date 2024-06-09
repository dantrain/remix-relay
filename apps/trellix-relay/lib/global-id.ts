import { decodeGlobalID } from "@pothos/plugin-relay";

export const fromGlobalId = (globalId: string | number) =>
  decodeGlobalID(globalId.toString()).id;
