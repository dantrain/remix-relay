import { omit, pick } from "lodash-es";
import invariant from "tiny-invariant";
import wait from "~/lib/wait";
import type { Movie } from "./data";
import { movies } from "./data";

export default {
  getMovies: async (options?: { select?: (keyof Movie)[]; delay?: number }) => {
    await wait(options?.delay);

    return movies.map((_) => {
      if (options?.select) {
        return pick(_, options.select);
      }

      return omit(_, ["reviews"]) as Omit<Movie, "reviews">;
    });
  },
  getMovie: async (
    slug?: string,
    options?: { select?: (keyof Movie)[]; delay?: number },
  ) => {
    const movie = movies.find((_) => _.slug === slug);
    invariant(movie, "Movie not found");

    await wait(options?.delay);

    if (options?.select) {
      return pick(movie, options.select);
    }

    return omit(movie, ["reviews"]) as Omit<Movie, "reviews">;
  },
  getReviews: async (
    slug?: string,
    options?: { select?: (keyof Movie["reviews"])[]; delay?: number },
  ) => {
    const movie = movies.find((_) => _.slug === slug);
    invariant(movie, "Movie not found");
    const reviews = pick(movie, ["reviews"]).reviews;

    await wait(options?.delay);

    if (options?.select) {
      return pick(reviews, options.select);
    }

    return reviews;
  },
  setMovieLiked: async (
    slug: string,
    liked: boolean,
    options?: { delay?: number },
  ) => {
    const movie = movies.find((_) => _.slug === slug);
    invariant(movie, "Movie not found");

    await wait(options?.delay);

    movie.liked = liked;
  },
};
