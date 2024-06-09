ALTER TABLE "columns" ADD COLUMN "rank" text NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "column_board_idx" ON "columns" USING btree (board_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "column_rank_idx" ON "columns" USING btree (rank);