"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

// ---------------------------------------------------------------------------
// Interface Context
// ---------------------------------------------------------------------------

interface AuthContextValue {
  /** User object dari Supabase Auth (null jika belum login) */
  user: User | null;
  /** Data profil dari tabel `profiles` (null jika belum login / belum ter-load) */
  profile: Profile | null;
  /** true jika user login dan role-nya 'admin' */
  isAdmin: boolean;
  /** true selama proses cek sesi awal (hindari flicker di UI) */
  isLoading: boolean;
  /** Sign out dan bersihkan state lokal */
  signOut: () => Promise<void>;
  /** Paksa refresh profil dari DB (berguna setelah update profil) */
  refreshProfile: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Context & Hook
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Hook untuk mengakses data autentikasi dari mana saja dalam komponen client.
 *
 * Wajib dipakai di dalam komponen yang dibungkus `<AuthProvider>`.
 * Jika dipanggil di luar provider, akan melempar error deskriptif.
 *
 * Contoh:
 * ```tsx
 * const { user, isAdmin, signOut } = useAuth();
 * ```
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "`useAuth()` harus dipakai di dalam komponen yang dibungkus <AuthProvider>.\n" +
        "Pastikan <AuthProvider> ada di layout root (src/app/layout.tsx).",
    );
  }
  return context;
}

// ---------------------------------------------------------------------------
// Provider Component
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // useMemo: createBrowserClient sudah singleton, tapi useMemo memastikan
  // tidak ada pembuatan object baru tiap render di environment yang strict.
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper: ambil data profil dari tabel profiles berdasarkan user ID
  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // Profil mungkin belum ada jika trigger handle_new_user belum selesai
        // atau terjadi race condition — tidak perlu crash, cukup set null
        console.warn("[AuthProvider] Gagal ambil profil:", error.message);
        setProfile(null);
        return;
      }

      setProfile(data as Profile);
    },
    [supabase],
  );

  /** Paksa re-fetch profil (berguna setelah user update nama/alamat) */
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  useEffect(() => {
    let isMounted = true;

    // ── Langkah 1: Cek sesi saat komponen pertama kali mount ──────────────
    // getUser() memvalidasi token ke Supabase server, berbeda dengan getSession()
    // yang hanya membaca cookie tanpa validasi (kurang aman untuk cek state awal).
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      if (!isMounted) return;

      setUser(currentUser);

      if (currentUser) {
        fetchProfile(currentUser.id).finally(() => {
          if (isMounted) setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // ── Langkah 2: Subscribe ke perubahan auth (login/logout/token refresh) ─
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      const sessionUser = session?.user ?? null;
      setUser(sessionUser);

      if (sessionUser) {
        // Fetch profil baru setelah event SIGNED_IN / TOKEN_REFRESHED
        fetchProfile(sessionUser.id);
      } else {
        // Event SIGNED_OUT — bersihkan profil
        setProfile(null);
      }
      // isLoading sudah diurus di getUser() di atas; tidak perlu set ulang
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    // State akan dibersihkan otomatis lewat onAuthStateChange (SIGNED_OUT event)
    // tapi kita set langsung juga untuk respons UI yang lebih cepat
    setUser(null);
    setProfile(null);
  }, [supabase]);

  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, profile, isAdmin, isLoading, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
