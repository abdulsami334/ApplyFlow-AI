"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Layers3, Sparkles } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { getErrorMessage } from "@/lib/errors";
import { routes } from "@/lib/routes";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ email, password });
      router.replace(routes.dashboard);
    } catch (registerError) {
      setError(getErrorMessage(registerError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#eef2ff,transparent_36%),#f8fafc] px-4 py-10 text-slate-950">
          <Card className="w-full max-w-md animate-fade-in-up border-white/80 bg-white/90 shadow-2xl shadow-slate-300/50 backdrop-blur">
            <CardHeader className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Layers3 className="h-6 w-6" />
              </div>
              <CardTitle className="text-3xl">Create account</CardTitle>
              <CardDescription>
                Start organizing opportunities, follow-ups, and resume matches in one workspace.
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <p className="text-xs text-slate-500">Use at least 8 characters.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="font-medium text-primary hover:underline" href={routes.login}>
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
        </section>

        <section className="relative hidden overflow-hidden px-10 py-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.35),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(99,102,241,0.5),transparent_28%),linear-gradient(135deg,#020617,#111827_45%,#312e81)]" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950">
              <Sparkles className="h-6 w-6" />
            </span>
            <div>
              <p className="text-lg font-bold">ApplyFlow</p>
              <p className="text-sm text-slate-300">Application management, no noise</p>
            </div>
          </div>
          <div className="relative max-w-xl">
            <h1 className="text-5xl font-bold tracking-tight">
              Build a reliable operating system for your job search.
            </h1>
            <div className="mt-8 space-y-4">
              {[
                "Track every company, role, and follow-up",
                "Review status distribution and monthly activity",
                "Move between table and board views without losing context",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <CheckCircle2 className="h-5 w-5 text-cyan-200" />
                  <span className="text-sm text-slate-100">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
