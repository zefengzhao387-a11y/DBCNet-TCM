"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <div className="h-9 w-9 animate-pulse rounded-full bg-muted/80" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel w-full max-w-[400px] rounded-3xl border p-8 shadow-lg"
    >
      <div className="mb-8 space-y-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          DBCNet-TCM
        </h1>
        <p className="text-sm text-muted-foreground">中医智能决策支持工作站</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="staffId">用户名 / 工号</Label>
          <Input
            id="staffId"
            name="staffId"
            autoComplete="username"
            placeholder="例如：TCM-2048"
            value={staffId}
            onChange={(ev) => setStaffId(ev.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">密码</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="演示环境任意非空即可"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
        <Button type="submit" className="h-11 w-full rounded-xl text-[15px]">
          登录
        </Button>
        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
          Mock 鉴权：无后端校验，仅写入本地状态。
        </p>
      </form>
    </motion.div>
  );
}
