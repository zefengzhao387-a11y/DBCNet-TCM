import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

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

if (fs.existsSync(lockPath)) {
  const raw = fs.readFileSync(lockPath, "utf8").trim();
  const pid = Number.parseInt(raw, 10);
  if (Number.isInteger(pid) && isAlive(pid)) {
    console.error(`build:safe 检测到 dev 正在运行 (pid=${pid})，已阻止构建。`);
    console.error("请先停止 dev 服务（Ctrl+C），再执行 build:safe。");
    process.exit(1);
  }
  fs.rmSync(lockPath);
}

try {
  fs.rmSync(path.join(projectRoot, ".next"), { recursive: true, force: true });
} catch (e) {
  if (e && typeof e === "object" && "code" in e && e.code !== "ENOENT") {
    throw e;
  }
}

execFileSync(process.execPath, [nextBin, "build"], {
  cwd: projectRoot,
  stdio: "inherit",
  env: process.env,
});

