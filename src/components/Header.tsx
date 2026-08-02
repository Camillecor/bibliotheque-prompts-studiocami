import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Library, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#0a1a3d]">
            <Sparkles className="h-4 w-4 text-sky-300" />
          </span>
          <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-navy">
            Studio Cami IA
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link to="/" className="cami-btn" activeOptions={{ exact: true }}>
            <Sparkles className="h-4 w-4" />
            Générateur
          </Link>
          <Link to="/bibliotheque" className="cami-btn">
            <Library className="h-4 w-4" />
            Bibliothèque
          </Link>
          {user ? (
            <button
              type="button"
              className="cami-btn"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/auth" });
              }}
            >
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </button>
          ) : (
            <Link to="/auth" className="cami-btn">
              Se connecter
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
