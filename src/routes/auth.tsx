import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion — Studio Cami IA" },
      {
        name: "description",
        content: "Connecte-toi pour générer tes prompts MARIO et retrouver ta bibliothèque.",
      },
      { property: "og:title", content: "Connexion — Studio Cami IA" },
      {
        property: "og:description",
        content: "Accède à ton générateur de prompts MARIO et à ta bibliothèque personnelle.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Compte créé, tu es connectée !");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bon retour !");
      }
      navigate({ to: "/" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-md py-6">
        <div className="cami-card-hero space-y-5">
          <div>
            <h1 className="text-2xl font-extrabold">
              {mode === "login" ? "Se connecter" : "Créer un compte"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ta bibliothèque de prompts MARIO est privée et rattachée à ton compte.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Ton email"
              className="cami-input"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Ton mot de passe"
              className="cami-input"
            />
            <button type="submit" className="cami-cta w-full" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
              {mode === "login" ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>

          <button
            type="button"
            className="cami-btn w-full"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Pas encore de compte ? S'inscrire" : "J'ai déjà un compte"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
