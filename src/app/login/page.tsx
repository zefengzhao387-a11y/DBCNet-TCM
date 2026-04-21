"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const api = useAuthStore.persist;
    if (!api) {
      setHydrated(true);
      return;
    }
    if (api.hasHydrated()) {
      setHydrated(true);
    }
    return api.onFinishHydration(() => {
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [hydrated, isAuthenticated, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(staffId, password);
    router.push("/");
  }

  if (!hydrated) {
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
          岐黄智鉴
        </p>
        <h1 className="font-serif text-2xl font-medium tracking-[0.2em] text-foreground">
          入室
        </h1>
        <p className="font-sans text-[13px] font-light text-muted-foreground">
          轻叩门环，随四时气韵进入工作站
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Input
            id="staffId"
            name="staffId"
            autoComplete="username"
            placeholder="用户名 / 工号"
            value={staffId}
            onChange={(ev) => setStaffId(ev.target.value)}
            className="h-12 rounded-2xl border-white/40 bg-white/25 text-[15px] shadow-inner backdrop-blur-sm placeholder:text-muted-foreground/75 focus-visible:ring-2 focus-visible:ring-primary/35"
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
          />
        </div>
        <Button
          type="submit"
          className="h-12 w-full rounded-2xl text-[15px] tracking-[0.12em] shadow-md"
        >
          进入
        </Button>
        <p className="text-center font-sans text-[10px] leading-relaxed text-muted-foreground/90">
          演示鉴权 · 本地状态 · 无后端校验
        </p>
      </form>
    </motion.div>
  );
}
