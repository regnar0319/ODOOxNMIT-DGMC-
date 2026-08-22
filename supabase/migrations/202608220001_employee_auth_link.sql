-- Safe employee identity migration. Existing rows are preserved.
alter table public.employees add column if not exists auth_user_id uuid;
alter table public.employees add column if not exists employee_id text;
alter table public.employees add column if not exists full_name text;
alter table public.employees add column if not exists email text;
alter table public.employees add column if not exists phone text;
alter table public.employees add column if not exists address text;
alter table public.employees add column if not exists profile_picture_url text;
alter table public.employees add column if not exists department text;
alter table public.employees add column if not exists designation text;
alter table public.employees add column if not exists manager text;
alter table public.employees add column if not exists location text;
alter table public.employees add column if not exists joining_date date;
alter table public.employees add column if not exists employment_status text default 'Active';
alter table public.employees add column if not exists role text default 'employee';
alter table public.employees add column if not exists created_at timestamptz default now();
alter table public.employees add column if not exists updated_at timestamptz default now();

create unique index if not exists employees_auth_user_id_unique on public.employees (auth_user_id) where auth_user_id is not null;
create unique index if not exists employees_employee_id_unique on public.employees (employee_id) where employee_id is not null;

alter table public.employees enable row level security;
drop policy if exists "Employees can view own profile" on public.employees;
create policy "Employees can view own profile" on public.employees for select to authenticated using (auth_user_id = auth.uid());
drop policy if exists "Employees can update own contact details" on public.employees;
create policy "Employees can update own contact details" on public.employees for update to authenticated using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());

drop policy if exists "HR can view employee profiles" on public.employees;
create policy "HR can view employee profiles" on public.employees for select to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('hr', 'admin'));

-- HR access is intended to be granted through a server-side service role or
-- an existing secure role/claim policy; public signup never assigns HR.
