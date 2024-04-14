import {
  GraphQLDeferDirective,
  GraphQLStreamDirective,
  specifiedDirectives,
} from "graphql";
import invariant from "tiny-invariant";
import { builder } from "./builder";
import * as types from "./types";

invariant(types);

export const schema = builder.toSchema({
  directives: [
    ...specifiedDirectives,
    GraphQLDeferDirective,
    GraphQLStreamDirective,
  ],
});
