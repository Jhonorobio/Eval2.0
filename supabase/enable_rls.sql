-- Habilitar RLS para la tabla quiz_answers
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

-- Verificar que la política existente sea correcta
CREATE POLICY IF NOT EXISTS "Enable all operations" 
  ON public.quiz_answers 
  FOR ALL 
  USING (true)
  WITH CHECK (true);