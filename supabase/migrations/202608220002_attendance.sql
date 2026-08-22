-- Attendance table migration

CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.employees(id),
    attendance_date DATE NOT NULL,
    check_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    working_hours NUMERIC,
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(employee_id, attendance_date)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Employees can read their own attendance
CREATE POLICY "Employees can view own attendance" ON public.attendance
    FOR SELECT TO authenticated
    USING (employee_id IN (SELECT id FROM public.employees WHERE auth_user_id = auth.uid()));

-- Employees can insert their own attendance
CREATE POLICY "Employees can insert own attendance" ON public.attendance
    FOR INSERT TO authenticated
    WITH CHECK (employee_id IN (SELECT id FROM public.employees WHERE auth_user_id = auth.uid()));

-- Employees can update their own attendance
CREATE POLICY "Employees can update own attendance" ON public.attendance
    FOR UPDATE TO authenticated
    USING (employee_id IN (SELECT id FROM public.employees WHERE auth_user_id = auth.uid()))
    WITH CHECK (employee_id IN (SELECT id FROM public.employees WHERE auth_user_id = auth.uid()));

-- HR can view all attendance
CREATE POLICY "HR can view all attendance" ON public.attendance
    FOR SELECT TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('hr', 'admin'));

-- HR can update all attendance
CREATE POLICY "HR can update all attendance" ON public.attendance
    FOR UPDATE TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('hr', 'admin'))
    WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('hr', 'admin'));
