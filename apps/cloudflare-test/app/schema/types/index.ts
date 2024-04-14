import type { Movie } from "./Movie";
import type { Review } from "./Review";

export { movies } from "./Movie";
export { reviews } from "./Review";

export type Objects = {
  Movie: Movie;
  Review: Review;
};
