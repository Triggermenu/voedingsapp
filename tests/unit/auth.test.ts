import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock de supabase module zodat we geen echte credentials nodig hebben
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
    from: vi.fn(),
  },
}))

import { supabase } from '@/lib/supabase'
import { getSession, signIn, signOut, resetPasswordForEmail, getAdminStatus } from '@/lib/auth'

const mockAuth = supabase.auth as ReturnType<typeof vi.fn> & {
  getSession: ReturnType<typeof vi.fn>
  signInWithPassword: ReturnType<typeof vi.fn>
  signOut: ReturnType<typeof vi.fn>
  resetPasswordForEmail: ReturnType<typeof vi.fn>
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getSession', () => {
  it('geeft null terug als er geen sessie is', async () => {
    mockAuth.getSession.mockResolvedValue({ data: { session: null } })
    const session = await getSession()
    expect(session).toBeNull()
  })

  it('geeft de sessie terug als ingelogd', async () => {
    const fakeSession = { user: { id: 'abc-123' }, access_token: 'token' }
    mockAuth.getSession.mockResolvedValue({ data: { session: fakeSession } })
    const session = await getSession()
    expect(session).toEqual(fakeSession)
  })
})

describe('signIn', () => {
  it('roept signInWithPassword aan met email en wachtwoord', async () => {
    mockAuth.signInWithPassword.mockResolvedValue({ data: {}, error: null })
    await signIn('test@voorbeeld.nl', 'geheimwachtwoord')
    expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@voorbeeld.nl',
      password: 'geheimwachtwoord',
    })
  })

  it('geeft de fout terug bij onjuiste creds', async () => {
    const fakeError = { message: 'Invalid login credentials' }
    mockAuth.signInWithPassword.mockResolvedValue({ data: null, error: fakeError })
    const result = await signIn('test@voorbeeld.nl', 'fout')
    expect(result.error).toEqual(fakeError)
  })
})

describe('signOut', () => {
  it('roept supabase.auth.signOut aan', async () => {
    mockAuth.signOut.mockResolvedValue({ error: null })
    await signOut()
    expect(mockAuth.signOut).toHaveBeenCalledOnce()
  })
})

describe('resetPasswordForEmail', () => {
  it('roept resetPasswordForEmail aan met het opgegeven adres', async () => {
    mockAuth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null })
    await resetPasswordForEmail('peter@voorbeeld.nl')
    expect(mockAuth.resetPasswordForEmail).toHaveBeenCalledWith(
      'peter@voorbeeld.nl',
      expect.objectContaining({ redirectTo: expect.stringContaining('/admin/wachtwoord-reset') }),
    )
  })
})

describe('getAdminStatus', () => {
  it('geeft false terug als er geen profiel is', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'not found' } }),
    })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockImplementation(mockFrom)

    const result = await getAdminStatus('user-id-123')
    expect(result).toBe(false)
  })

  it('geeft false terug als is_admin false is', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { is_admin: false }, error: null }),
    })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockImplementation(mockFrom)

    const result = await getAdminStatus('user-id-123')
    expect(result).toBe(false)
  })

  it('geeft true terug als is_admin true is', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { is_admin: true }, error: null }),
    })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockImplementation(mockFrom)

    const result = await getAdminStatus('user-id-123')
    expect(result).toBe(true)
  })
})
