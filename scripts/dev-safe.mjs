import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawn } from "node:child_process";

const projectRoot = process.cwd();
const lockPath = path.join(projectRoot, ".dev-server.pid");
const nextBin = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");

function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function removeLock() {
  try {
    fs.rmSync(lockPath);
  } catch {
    // ignore
  }
}

if (fs.existsSync(lockPath)) {
  const raw = fs.readFileSync(lockPath, "utf8").trim();
  const pid = Number.parseInt(raw, 10);
  if (Number.isInteger(pid) && isAlive(pid)) {
    console.error(`dev:safe 检测到已有开发服务在运行 (pid=${pid})。`);
    console.error("请先停止现有 dev（Ctrl+C）再执行，或删除 .dev-server.pid（确认进程已退出）。");
    process.exit(1);
  }
  removeLock();
}

fs.writeFileSync(lockPath, String(process.pid), "utf8");
process.on("SIGINT", () => {
  removeLock();
  process.exit(130);
});
process.on("SIGTERM", () => {
  removeLock();
  process.exit(143);
});
process.on("exit", removeLock);

try {
  fs.rmSync(path.join(projectRoot, ".next"), { recursive: true, force: true });
} catch (e) {
  if (e && typeof e === "object" && "code" in e && e.code !== "ENOENT") {
    throw e;
  }
}

const child = spawn(process.execPath, [nextBin, "dev"], {
  cwd: projectRoot,
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  removeLock();
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

