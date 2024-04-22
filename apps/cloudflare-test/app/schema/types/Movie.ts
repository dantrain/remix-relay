import { resolveArrayConnection } from "@pothos/plugin-relay";
import { and, eq, relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import invariant from "tiny-invariant";
import exists from "~/lib/exists";
import { fromGlobalId } from "~/lib/global-id";
import { builder } from "../builder";
import { Review, reviews } from "./Review";
import { usersToMovies } from "./UserToMovie";

export const movies = sqliteTable("movies", {
  id: text("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  criticScore: integer("critic_score").notNull(),
  audienceScore: integer("audience_score").notNull(),
  criticsConsensus: text("critics_consensus").notNull(),
  boxOffice: text("box_office").notNull(),
  imgUrl: text("img_url").notNull(),
});

export const moviesRelations = relations(movies, ({ many }) => ({
  reviews: many(reviews),
  usersToMovies: many(usersToMovies),
}));

export type Movie = typeof movies.$inferSelect;

export const Movie = builder.node("Movie", {
  isTypeOf: () => true,
  id: { resolve: (_) => _.id },
  loadOne: async (id, { db }) => {
    const result = await db.query.movies.findFirst({
      where: eq(movies.id, id),
    });

    return exists(result, "Movie not found");
  },
  fields: (t) => ({
    slug: t.exposeString("slug"),
    title: t.exposeString("title"),
    criticScore: t.exposeInt("criticScore"),
    audienceScore: t.exposeInt("audienceScore"),
    criticsConsensus: t.exposeString("criticsConsensus"),
    boxOffice: t.exposeString("boxOffice"),
    imgUrl: t.exposeString("imgUrl"),
    reviews: t.connection({
      type: Review,
      resolve: async ({ id }, args, { db }) => {
        const result = await db.query.reviews.findMany({
          where: eq(reviews.movieId, id),
        });

        return resolveArrayConnection({ args }, result);
      },
    }),
    likedByViewer: t.field({
      type: "Boolean",
      nullable: true,
      resolve: async ({ id }, _args, { db, user }) => {
        if (!user) return null;

        const result = await db.query.usersToMovies.findFirst({
          where: and(
            eq(usersToMovies.userEmail, user.email),
            eq(usersToMovies.movieId, id),
          ),
        });

        return result?.liked;
      },
    }),
  }),
});

builder.queryField("movie", (t) =>
  t.field({
    type: Movie,
    args: {
      slug: t.arg.string({ required: true }),
    },
    resolve: async (_parent, { slug }, { db }) => {
      const result = await db.query.movies.findFirst({
        where: eq(movies.slug, slug),
      });

      return exists(result, "Movie not found");
    },
  }),
);

builder.queryField("movies", (t) =>
  t.connection({
    type: Movie,
    resolve: async (_parent, args, { db }) => {
      const result = await db.query.movies.findMany();

      return resolveArrayConnection({ args }, result);
    },
  }),
);

builder.mutationField("setLikedMovie", (t) =>
  t.field({
    type: Movie,
    args: {
      id: t.arg.id({ required: true }),
      liked: t.arg.boolean({ required: true }),
    },
    resolve: async (_parent, { id, liked }, { db, user }) => {
      invariant(user, "Must be signed in");

      await db
        .insert(usersToMovies)
        .values({ movieId: fromGlobalId(id), userEmail: user.email, liked })
        .onConflictDoUpdate({
          target: [usersToMovies.movieId, usersToMovies.userEmail],
          set: { liked },
        });

      const result = await db.query.movies.findFirst({
        where: eq(movies.id, fromGlobalId(id)),
      });

      return exists(result, "Movie not found");
    },
  }),
);
