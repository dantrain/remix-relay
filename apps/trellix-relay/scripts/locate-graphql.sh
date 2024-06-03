#!/bin/bash

# Used by the Relay LSP to find the location of a symbol in the source code.
pnpm exec zx ./scripts/locate-graphql.mjs $2
