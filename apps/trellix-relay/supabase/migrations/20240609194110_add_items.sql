CREATE TABLE IF NOT EXISTS "items" (
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar NOT NULL,
	"rank" varchar NOT NULL,
	"user_id" uuid NOT NULL,
	"column_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_column_id_columns_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."columns"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "item_column_idx" ON "items" USING btree (column_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "item_rank_idx" ON "items" USING btree (rank);
--> statement-breakpoint
ALTER publication supabase_realtime ADD TABLE "items";
