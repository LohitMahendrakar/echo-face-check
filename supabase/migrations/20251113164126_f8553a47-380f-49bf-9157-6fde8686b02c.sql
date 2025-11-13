-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  roll_no TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create class_sessions table
CREATE TABLE public.class_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.class_sessions(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, session_id)
);

-- Enable Row Level Security (RLS) for public access since this is a classroom tool
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (suitable for classroom environment)
CREATE POLICY "Students are viewable by everyone" 
ON public.students 
FOR SELECT 
USING (true);

CREATE POLICY "Students can be inserted by everyone" 
ON public.students 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Students can be updated by everyone" 
ON public.students 
FOR UPDATE 
USING (true);

CREATE POLICY "Students can be deleted by everyone" 
ON public.students 
FOR DELETE 
USING (true);

CREATE POLICY "Class sessions are viewable by everyone" 
ON public.class_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Class sessions can be inserted by everyone" 
ON public.class_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Class sessions can be updated by everyone" 
ON public.class_sessions 
FOR UPDATE 
USING (true);

CREATE POLICY "Class sessions can be deleted by everyone" 
ON public.class_sessions 
FOR DELETE 
USING (true);

CREATE POLICY "Attendance is viewable by everyone" 
ON public.attendance 
FOR SELECT 
USING (true);

CREATE POLICY "Attendance can be inserted by everyone" 
ON public.attendance 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Attendance can be updated by everyone" 
ON public.attendance 
FOR UPDATE 
USING (true);

CREATE POLICY "Attendance can be deleted by everyone" 
ON public.attendance 
FOR DELETE 
USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_attendance_student_id ON public.attendance(student_id);
CREATE INDEX idx_attendance_session_id ON public.attendance(session_id);
CREATE INDEX idx_class_sessions_date ON public.class_sessions(date);