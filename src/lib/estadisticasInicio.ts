// src/lib/estadisticasInicio.ts
import { createServerClient } from '@/utils/supabase'

export async function registrarVisitaInicio(ip: string | null) {
  const supabase = createServerClient()

  const { error } = await supabase.rpc('registrar_visita_inicio', {
    p_ip: ip,
  })

  if (error) {
    // No rompas la página por esto, solo loguea
    console.error('Error registrando visita de inicio:', error.message)
  }
}
