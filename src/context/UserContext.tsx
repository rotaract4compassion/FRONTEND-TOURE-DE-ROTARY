'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'
import { signOut as authSignOut } from '@/lib/supabase/auth'
import type { User } from '@supabase/supabase-js'
import type { UserContextValue, UserProfile } from '@/types'

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data as UserProfile | null)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) fetchProfile(u.id).finally(() => setLoading(false))
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) fetchProfile(u.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSignOut() {
    await authSignOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <UserContext.Provider value={{ user, profile, loading, signOut: handleSignOut }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext(): UserContextValue {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUserContext must be used inside <UserProvider>')
  return ctx
}