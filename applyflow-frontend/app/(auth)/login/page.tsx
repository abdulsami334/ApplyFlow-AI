"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BriefcaseBusiness, Layers3, ShieldCheck } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { getErrorMessage } from "@/lib/errors";
import { routes } from "@/lib/routes";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(routes.dashboard);
    }
  }, [isAuthenticated, isLoading, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      router.replace(routes.dashboard);
    } catch (loginError) {
      setError(getErrorMessage(loginError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden px-10 py-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.45),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.28),transparent_28%),linear-gradient(135deg,#020617,#111827_48%,#312e81)]" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950">
              <Layers3 className="h-6 w-6" />
            </span>
            <div>
              <p className="text-lg font-bold">ApplyFlow</p>
              <p className="text-sm text-slate-300">Focused job search workspace</p>
            </div>
          </div>

          <div className="relative max-w-xl">
            <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-100">
              Built for focused job search execution
            </p>
            <h1 className="text-5xl font-bold tracking-tight">
              Organize every opportunity from first apply to final offer.
            </h1>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-black/10 backdrop-blur">
                <BriefcaseBusiness className="mb-3 h-5 w-5 text-cyan-200" />
                <p className="text-sm text-slate-200">Track applications, follow-ups, and status movement.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-black/10 backdrop-blur">
                <ShieldCheck className="mb-3 h-5 w-5 text-indigo-200" />
                <p className="text-sm text-slate-200">Stay organized with a private workspace built around your progress.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#eef2ff,transparent_36%),#f8fafc] px-4 py-10 text-slate-950">
          <Card className="w-full max-w-md animate-fade-in-up border-white/80 bg-white/90 shadow-2xl shadow-slate-300/50 backdrop-blur">
            <CardHeader className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white lg:hidden">
                <Layers3 className="h-6 w-6" />
              </div>
              <CardTitle className="text-3xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to track your applications with confidence.
              </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error ? <Alert variant="destructive">{error}</Alert> : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password">Password</Label>
                <Link className="text-xs font-semibold text-primary hover:underline" href={routes.forgotPassword}>
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link className="font-medium text-primary hover:underline" href={routes.register}>
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
        </section>
      </div>
    </main>
  );
}
