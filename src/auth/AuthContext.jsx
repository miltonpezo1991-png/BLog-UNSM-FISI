import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setCargando(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  async function iniciarSesion(correo, contrasena) {
    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: contrasena,
    })
    return { error }
  }

  async function crearCuenta(correo, contrasena) {
    const { error } = await supabase.auth.signUp({
      email: correo,
      password: contrasena,
    })
    return { error }
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{ user, cargando, iniciarSesion, crearCuenta, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}