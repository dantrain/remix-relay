alter table "public"."columns" enable row level security;

create policy "Enable all operations for authenticated users based on userId"
on "public"."columns"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



