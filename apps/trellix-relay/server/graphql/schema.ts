import {
  GraphQLDeferDirective,
  GraphQLStreamDirective,
  specifiedDirectives,
} from "graphql";
import { builder } from "./builder";
import "./types";

export const schema = builder.toSchema({
  directives: [
    ...specifiedDirectives,
    GraphQLDeferDirective,
    GraphQLStreamDirective,
  ],
});
