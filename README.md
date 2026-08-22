# ODOOxNMIT-DGMC-

## Supabase sign-in

The sign-in form uses Supabase Auth when these environment variables are set:

- `SUPABASE_URL`: your Supabase project URL
- `SUPABASE_ANON_KEY`: your Supabase anon/publishable key

Create users in Supabase Authentication and set their `app_metadata.role` to
`employee` or `hr`. Do not expose a service-role key to the browser.

## Supabase database setup

Apply `supabase/migrations/202608220001_employee_auth_link.sql` to the existing
database. It preserves existing rows, adds the `auth_user_id` relationship and
uniqueness constraints, enables RLS, and adds own-profile/HR read policies.

Configure the server with:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` for server-side employee profile provisioning and HR directory reads

The service-role key must only exist in the server/Render environment. New
public registrations are always created as employees; HR accounts must be
provisioned by an authorized administrator.