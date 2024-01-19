#!/usr/bin/env zx
/* eslint-disable no-undef */
import { argv, path } from "zx";
import { ts } from "@ast-grep/napi";

const [type, field] = argv._[0].split(".");

const builderCallMatcher = ["Query", "Mutation", "Subscription"].includes(type)
  ? {
      kind: "call_expression",
      has: {
        kind: "arguments",
        follows: {
          kind: "member_expression",
          all: [
            {
              has: {
                kind: "identifier",
                regex: "^builder$",
              },
            },
            {
              has: {
                kind: "property_identifier",
                regex: `^${type.toLowerCase()}Type$`,
              },
            },
          ],
        },
      },
    }
  : {
      kind: "call_expression",
      has: {
        kind: "arguments",
        has: {
          kind: "string",
          regex: `^["']${type}["']$`,
        },
        follows: {
          kind: "member_expression",
          has: {
            kind: "identifier",
            regex: "^builder$",
          },
        },
      },
    };

const matcher =
  field === "id"
    ? {
        rule: {
          kind: "pair",
          has: {
            field: "key",
            regex: `^["']?id["']?$`,
          },
          inside: {
            kind: "call_expression",
            has: {
              kind: "arguments",
              has: {
                kind: "string",
                regex: `^["']${type}["']$`,
              },
              follows: {
                kind: "member_expression",
                all: [
                  {
                    has: {
                      kind: "identifier",
                      regex: "^builder$",
                    },
                  },
                  {
                    has: {
                      kind: "property_identifier",
                      regex: `^node$`,
                    },
                  },
                ],
              },
            },
            stopBy: "end",
          },
        },
      }
    : field
      ? {
          rule: {
            kind: "property_identifier",
            regex: `^["']?${field}["']?$`,
            inside: {
              kind: "pair",
              has: {
                field: "key",
                regex: `^["']?fields["']?$`,
              },
              inside: {
                ...builderCallMatcher,
                stopBy: "end",
              },
              stopBy: "end",
            },
          },
        }
      : { rule: builderCallMatcher };

const data = await new Promise((resolve, reject) => {
  ts.findInFiles(
    {
      paths: ["./server/graphql"],
      matcher,
    },
    (err, result) => {
      if (err) reject(err);
      if (!result || !result.length) reject();

      const [node] = result;

      resolve({
        filename: node.getRoot().filename(),
        range: node.range(),
        text: node.text(),
      });
    },
  );
});

const filePath = path.join(import.meta.dirname, "../", data.filename);
const output = `${filePath}:${data.range.start.line + 1}:${data.range.start.column}`;

console.log(output);
