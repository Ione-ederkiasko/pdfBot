// src/components/AuthForm.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function AuthForm({
  onAuth,
}: {
  onAuth: (token: string) => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // según config, te pedirá confirmar email
        alert("Revisa tu correo para confirmar el registro.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        const token = data.session?.access_token;
        if (token) onAuth(token);
      }
    } catch (err: any) {
      setErrorMsg(err.message ?? "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto my-8">
      <h2 className="text-xl font-bold mb-4">
        {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
        <input
          type="password"
          required
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-1 rounded"
        >
          {loading
            ? "Cargando..."
            : mode === "login"
            ? "Entrar"
            : "Registrarme"}
        </button>
      </form>
      <button
        type="button"
        className="mt-2 text-sm underline"
        onClick={() =>
          setMode(mode === "login" ? "register" : "login")
        }
      >
        {mode === "login"
          ? "¿No tienes cuenta? Regístrate"
          : "¿Ya tienes cuenta? Inicia sesión"}
      </button>
    </div>
  );
}
