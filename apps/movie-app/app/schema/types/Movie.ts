import { eq, and } from "drizzle-orm";
import invariant from "tiny-invariant";
import exists from "~/lib/exists";
import { fromGlobalId } from "~/lib/global-id";
import { builder } from "../builder";
import { movies, usersToMovies } from "../db-schema";

export const Movie = builder.drizzleNode("movies", {
  name: "Movie",
  id: { column: (movie) => movie.id },
  fields: (t) => ({
    slug: t.exposeString("slug"),
    title: t.exposeString("title"),
    criticScore: t.exposeInt("criticScore"),
    audienceScore: t.exposeInt("audienceScore"),
    criticsConsensus: t.exposeString("criticsConsensus"),
    boxOffice: t.exposeString("boxOffice"),
    imgUrl: t.exposeString("imgUrl"),
    reviews: t.relatedConnection("reviews"),
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
  t.drizzleField({
    type: "movies",
    args: {
      slug: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, { slug }, { db }) => {
      const result = await db.query.movies.findFirst(
        query({
          where: eq(movies.slug, slug),
        }),
      );

      return exists(result, "Movie not found");
    },
  }),
);

builder.queryField("movies", (t) =>
  t.drizzleConnection({
    type: "movies",
    resolve: async (query, _parent, _args, { db }) =>
      db.query.movies.findMany(query()),
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
