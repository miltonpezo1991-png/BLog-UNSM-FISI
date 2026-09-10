export const UNIDADES = [
  { unidad: 1, titulo: 'Unidad I', semanas: 4 },
  { unidad: 2, titulo: 'Unidad II', semanas: 4 },
  { unidad: 3, titulo: 'Unidad III', semanas: 6 },
]

export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || ''

export function esAdmin(email) {
  return typeof email === 'string' && ADMIN_EMAIL !== '' && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
}