import { createPagesFunctionHandler } from "@react-router/cloudflare";
import * as build from "../build/server";

// @ts-expect-error Because
export const onRequest = createPagesFunctionHandler({ build });
