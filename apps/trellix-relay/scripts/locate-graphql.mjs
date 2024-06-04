#!/usr/bin/env zx

/* eslint-disable no-undef */
import { ts } from "@ast-grep/napi";
import { argv, path } from "zx";

const [type, field] = argv._[0].split(".");

let rule;

// builder.queryType etc.
if (!field && ["Query", "Mutation", "Subscription"].includes(type)) {
  rule = {
    kind: "property_identifier",
    regex: `^(${type.toLowerCase()})Type$`,
    follows: {
      kind: "identifier",
      regex: "^builder$",
      stopBy: "end",
    },
  };
}

// builder.node("Type" etc.
if (!field && !["Query", "Mutation", "Subscription"].includes(type)) {
  rule = {
    kind: "string",
    regex: `^["']${type}["']$`,
    inside: {
      kind: "arguments",
      inside: {
        kind: "call_expression",
        has: {
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
                regex: "^node$",
              },
            },
          ],
        },
      },
    },
  };
}

// builder.node("Type", { id: { resolve: etc.
if (
  field &&
  field === "id" &&
  !["Query", "Mutation", "Subscription"].includes(type)
) {
  rule = {
    kind: "property_identifier",
    regex: `^["']?id["']?$`,
    inside: {
      kind: "pair",
      inside: {
        kind: "object",
        follows: {
          kind: "string",
          regex: `^["']${type}["']$`,
          stopBy: "end",
        },
      },
    },
  };
}

// builder.node("Type", { fields: (t) => ({ field: t.field( etc.
if (
  field &&
  field !== "id" &&
  !["Query", "Mutation", "Subscription"].includes(type)
) {
  rule = {
    kind: "property_identifier",
    regex: `^["']?${field}["']?$`,
    inside: {
      kind: "pair",
      has: {
        kind: "property_identifier",
        regex: "^[\"']?fields[\"']?$",
      },
      stopBy: "end",
      inside: {
        kind: "call_expression",
        all: [
          {
            has: {
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
                    regex: "^node$",
                  },
                },
              ],
            },
          },
          {
            has: {
              kind: "arguments",
              has: {
                kind: "string",
                regex: `^["']${type}["']$`,
              },
            },
          },
        ],
        stopBy: "end",
      },
    },
  };
}

// builder.queryField("field" etc.
// builder.queryFields((t) => ({ field: t.field( etc.
// builder.queryType({ fields: (t) => ({ field: t.field( etc.
if (field && ["Query", "Mutation", "Subscription"].includes(type)) {
  rule = {
    any: [
      {
        kind: "string",
        regex: `^["']${field}["']$`,
        inside: {
          kind: "arguments",
          inside: {
            kind: "call_expression",
            has: {
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
                    regex: `^${type.toLowerCase()}Field$`,
                  },
                },
              ],
            },
          },
        },
      },
      {
        kind: "property_identifier",
        regex: `^["']?${field}["']?$`,
        inside: {
          kind: "call_expression",
          has: {
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
                  regex: `^${type.toLowerCase()}Fields?$`,
                },
              },
            ],
          },
          stopBy: "end",
        },
      },
      {
        kind: "property_identifier",
        regex: `^["']?${field}["']?$`,
        inside: {
          kind: "pair",
          has: {
            kind: "property_identifier",
            regex: `^["']?fields["']?$`,
          },
          stopBy: "end",
          inside: {
            kind: "call_expression",
            has: {
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
            stopBy: "end",
          },
        },
      },
    ],
  };
}

const data = await new Promise((resolve, reject) => {
  ts.findInFiles(
    {
      paths: ["./server/types"],
      matcher: { rule },
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
