import type { Movie } from "./Movie";
import type { Review } from "./Review";
import type { User } from "./User";
import type { UserToMovie } from "./UserToMovie";

export { movies } from "./Movie";
export { reviews } from "./Review";
export { users } from "./User";
export { usersToMovies } from "./UserToMovie";

export type Objects = {
  Movie: Movie;
  Review: Review;
  User: User;
  UserToMovie: UserToMovie;
};
