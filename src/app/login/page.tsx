"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  const login = useAuthStore((s) => s.login);
  const fetchSession = useAuthStore((s) => s.fetchSession);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const sessionReady = useAuthStore((s) => s.sessionReady);
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    if (!sessionReady) return;
    if (isAuthenticated) {
      const dest = from.startsWith("/") ? from : "/";
      router.replace(dest);
    }
  }, [sessionReady, isAuthenticated, router, from]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await login(staffId, password);
      if (res.error) {
        setError(res.error);
        return;
      }
      const dest = from.startsWith("/") ? from : "/";
      router.push(dest);
    } finally {
      setSubmitting(false);
    }
  }

  if (!sessionReady) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="h-9 w-9 animate-pulse rounded-full bg-white/25" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="jade-login-card mx-auto w-full max-w-[min(22rem,calc(100vw-2rem))] rounded-[2rem] px-7 py-10 sm:px-9 sm:py-12"
    >
      <div className="mb-10 space-y-2 text-center">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.42em] text-muted-foreground">
          岐黄智诊
        </p>
        <h1 className="font-serif text-2xl font-medium tracking-[0.2em] text-foreground">入室</h1>
        <p className="font-sans text-[13px] font-light text-muted-foreground">
          轻叩门环，随四时气韵进入工作站
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error ? (
          <p className="text-center text-[13px] text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <div className="space-y-2">
          <Input
            id="staffId"
            name="staffId"
            autoComplete="username"
            placeholder="用户名 / 工号"
            value={staffId}
            onChange={(ev) => setStaffId(ev.target.value)}
            className="h-12 rounded-2xl border-white/40 bg-white/25 text-[15px] shadow-inner backdrop-blur-sm placeholder:text-muted-foreground/75 focus-visible:ring-2 focus-visible:ring-primary/35"
            disabled={submitting}
          />
        </div>
        <div className="space-y-2">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="密钥"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            className="h-12 rounded-2xl border-white/40 bg-white/25 text-[15px] shadow-inner backdrop-blur-sm placeholder:text-muted-foreground/75 focus-visible:ring-2 focus-visible:ring-primary/35"
            disabled={submitting}
          />
        </div>
        <Button
          type="submit"
          disabled={submitting}
          className="h-12 w-full rounded-2xl text-[15px] tracking-[0.12em] shadow-md"
        >
          {submitting ? "进入中…" : "进入"}
        </Button>
        <p className="text-center font-sans text-[10px] leading-relaxed text-muted-foreground/90">
          工号与密码由本机数据库校验；未配置 AUTH_SECRET 时无法登录
        </p>
      </form>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="h-9 w-9 animate-pulse rounded-full bg-white/25" />
        </div>
      }
    >
      <LoginFormInner />
    </Suspense>
  );
}
