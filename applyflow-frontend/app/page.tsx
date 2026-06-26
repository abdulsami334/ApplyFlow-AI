"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/shared/loading-state";
import { useAuth } from "@/context/auth-context";
import { routes } from "@/lib/routes";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    router.replace(isAuthenticated ? routes.dashboard : routes.login);
  }, [isAuthenticated, isLoading, router]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4">
      <LoadingState label="Opening your job search workspace..." />
    </main>
  );
}
