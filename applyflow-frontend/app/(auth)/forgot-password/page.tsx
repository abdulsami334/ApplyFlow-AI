import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/lib/routes";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#eef2ff,transparent_36%),linear-gradient(180deg,#f8fafc,#eef2f7)] px-4 py-10 text-slate-950">
      <Card className="w-full max-w-md animate-fade-in-up border-white/80 bg-white/90 shadow-2xl shadow-slate-300/50">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-8 ring-indigo-50/60">
            <MailCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Password reset</CardTitle>
          <CardDescription>
            Password reset is not connected yet. For now, return to sign in and use your existing account credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href={routes.login}>
            <Button type="button" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
