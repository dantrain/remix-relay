import { decodeGlobalID } from "@pothos/plugin-relay";

export const fromGlobalId = (globalId: string) => decodeGlobalID(globalId).id;
