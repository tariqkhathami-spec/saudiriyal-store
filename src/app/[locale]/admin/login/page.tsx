"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const isRtl = locale === "ar";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.replace("/admin");
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-gold font-bold text-xl">SR</span>
          </div>
          <h1
            className={cn(
              "text-2xl font-bold text-navy mb-2",
              isRtl ? "font-[family-name:var(--font-noto-naskh)]" : "font-[family-name:var(--font-playfair)]"
            )}
          >
            Admin Login
          </h1>
          <p className="text-muted text-sm">Sign in to manage your collection</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-navy mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-base"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-base"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold hover:bg-gold-light text-navy font-semibold rounded-lg transition-all disabled:opacity-50 text-base"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
