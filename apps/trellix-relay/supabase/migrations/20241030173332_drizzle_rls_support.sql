ALTER POLICY "Enable all operations for authenticated users based on userId" ON "boards" TO "authenticated" USING (
  (
    select
      auth.uid()
  ) = user_id
) WITH CHECK (
  (
    select
      auth.uid()
  ) = user_id
);

--> statement-breakpoint
ALTER POLICY "Enable all operations for authenticated users based on userId" ON "columns" TO "authenticated" USING (
  (
    select
      auth.uid()
  ) = user_id
) WITH CHECK (
  (
    select
      auth.uid()
  ) = user_id
);

--> statement-breakpoint
ALTER POLICY "Enable all operations for authenticated users based on userId" ON "items" TO "authenticated" USING (
  (
    select
      auth.uid()
  ) = user_id
) WITH CHECK (
  (
    select
      auth.uid()
  ) = user_id
);