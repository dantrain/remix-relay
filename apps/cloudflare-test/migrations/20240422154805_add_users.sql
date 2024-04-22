CREATE TABLE `users` (
	`email` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users_to_movies` (
	`user_email` text NOT NULL,
	`movie_id` text NOT NULL,
	`liked` integer,
	PRIMARY KEY(`movie_id`, `user_email`),
	FOREIGN KEY (`user_email`) REFERENCES `users`(`email`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE no action
);
