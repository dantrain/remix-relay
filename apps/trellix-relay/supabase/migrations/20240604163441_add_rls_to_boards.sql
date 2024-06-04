alter table "public"."boards" enable row level security;

create policy "Enable all operations for authenticated users based on userId"
on "public"."boards"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



