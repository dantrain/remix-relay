import SchemaBuilder from "@pothos/core";
import RelayPlugin, {
  decodeGlobalID,
  resolveArrayConnection,
} from "@pothos/plugin-relay";
import {
  GraphQLDeferDirective,
  GraphQLStreamDirective,
  specifiedDirectives,
} from "graphql";
import invariant from "tiny-invariant";
import type { Objects } from "../data/movie-data.js";
import { movies } from "../data/movie-data.js";
import wait from "../lib/wait.js";

const builder = new SchemaBuilder<{
  Objects: Objects;
  DefaultEdgesNullability: false;
}>({
  plugins: [RelayPlugin],
  relayOptions: {
    clientMutationId: "omit",
    cursorType: "String",
    edgesFieldOptions: { nullable: false },
  },
});

const Movie = builder.node("Movie", {
  isTypeOf: () => true,
  id: { resolve: (movie) => movie.slug },
  loadOne: (slug) => movies.find((_) => _.slug === slug),
  fields: (t) => ({
    slug: t.exposeString("slug"),
    title: t.exposeString("title"),
    criticScore: t.exposeInt("criticScore"),
    audienceScore: t.exposeInt("audienceScore"),
    criticsConsensus: t.exposeString("criticsConsensus"),
    boxOffice: t.exposeString("boxOffice"),
    imgUrl: t.exposeString("imgUrl"),
    liked: t.exposeBoolean("liked"),
    reviews: t.connection({
      type: Review,
      resolve: async (parent, args) => {
        await wait(750);
        return resolveArrayConnection({ args }, parent.reviews);
      },
    }),
  }),
});

const Review = builder.node("Review", {
  id: { resolve: (review) => review.quote },
  fields: (t) => ({
    quote: t.exposeString("quote"),
    fresh: t.exposeBoolean("fresh"),
    criticName: t.exposeString("criticName"),
    criticSource: t.exposeString("criticSource"),
  }),
});

builder.queryType({
  fields: (t) => ({
    movies: t.field({
      type: [Movie],
      resolve: async () => {
        await wait(750);
        return movies;
      },
    }),
    movieConnection: t.connection({
      type: Movie,
      resolve: (_parent, args) => resolveArrayConnection({ args }, movies),
    }),
    movie: t.field({
      type: Movie,
      args: {
        slug: t.arg.string({ required: true }),
      },
      resolve: async (_parent, { slug }) => {
        await wait(750);
        const movie = movies.find((_) => _.slug === slug);
        invariant(movie, "Movie not found");
        return movie;
      },
    }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    setLikedMovie: t.field({
      type: Movie,
      args: {
        id: t.arg.id({ required: true }),
        liked: t.arg.boolean({ required: true }),
      },
      resolve: async (_parent, { id, liked }) => {
        await wait(750);
        const movie = movies.find(
          (_) => _.slug === decodeGlobalID(id.toString()).id,
        );

        invariant(movie, `Movie with id ${id} not found`);

        movie.liked = liked;

        return movie;
      },
    }),
  }),
});

export const schema = builder.toSchema({
  directives: [
    ...specifiedDirectives,
    GraphQLDeferDirective,
    GraphQLStreamDirective,
  ],
});
