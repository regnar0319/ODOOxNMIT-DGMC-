# ODOOxNMIT-DGMC-

## Supabase sign-in

The sign-in form uses Supabase Auth when these environment variables are set:

- `SUPABASE_URL`: your Supabase project URL
- `SUPABASE_ANON_KEY`: your Supabase anon/publishable key

Create users in Supabase Authentication and set their `app_metadata.role` to
`employee` or `hr`. Do not expose a service-role key to the browser.