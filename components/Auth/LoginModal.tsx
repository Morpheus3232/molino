"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { loginUser, registerUser } from "@/lib/auth/userService";

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: any) => void;
}

export default function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        const session = await loginUser(email, password);
        if (session) {
          onLogin(session.user);
          onClose();
        } else {
          setError("Credenciales incorrectas");
        }
      } else {
        const user = await registerUser(name, email, birthDate, password);
        onLogin(user);
        onClose();
      }
    } catch (err) {
      setError("Error al procesar la solicitud");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-card-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            {isLogin ? "Bienvenido de vuelta" : "Crear cuenta"}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-foreground">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-card-border rounded-xl text-sm text-foreground"
                required
              />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-card-border rounded-xl text-sm text-foreground"
                required
              />
            </>
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-card-border rounded-xl text-sm text-foreground"
            required
          />
          
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-card-border rounded-xl text-sm text-foreground"
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-foreground text-background rounded-xl hover:bg-foreground/80 transition-colors font-medium"
          >
            {isLogin ? "Iniciar sesión" : "Registrarse"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-sm text-muted hover:text-foreground w-full text-center"
        >
          {isLogin ? "¿No tenés cuenta? Registrate" : "¿Ya tenés cuenta? Iniciá sesión"}
        </button>
      </div>
    </motion.div>
  );
}
