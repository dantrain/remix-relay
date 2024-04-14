CREATE TABLE `movies` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`critic_score` integer NOT NULL,
	`audience_score` integer NOT NULL,
	`critics_consensus` text NOT NULL,
	`box_office` text NOT NULL,
	`img_url` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`quote` text NOT NULL,
	`fresh` integer NOT NULL,
	`critic_name` text NOT NULL,
	`critic_source` text NOT NULL,
	`movie_id` text NOT NULL,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `movies_slug_unique` ON `movies` (`slug`);--> statement-breakpoint
CREATE INDEX `review_movie_id` ON `reviews` (`movie_id`);