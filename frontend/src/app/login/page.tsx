"use client";

import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "../../lib/auth";
import { LoginPage } from "../../components/LoginPage";
import { useRouter } from "next/navigation";

function LoginContent() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return <LoginPage />;
}

export default function LoginPageWrapper() {
  return (
    <AuthProvider>
      <LoginContent />
    </AuthProvider>
  );
}
