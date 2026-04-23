import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

export const SESSION_COOKIE_NAME = "dbcnet_session";

const DAY_S = 86400;
const MAX_AGE_S = 7 * DAY_S;

function getAuthSecretKey(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error("AUTH_SECRET 需至少 16 位，已写入 .env 示例");
  }
  return new TextEncoder().encode(s);
}

export async function createSessionToken(payload: {
  sub: string;
  staffId: string;
  displayName: string;
}): Promise<string> {
  return new SignJWT({
    staffId: payload.staffId,
    displayName: payload.displayName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_S}s`)
    .sign(getAuthSecretKey());
}

export async function readSessionToken(token: string) {
  const { payload } = await jwtVerify(token, getAuthSecretKey());
  const sub = payload.sub;
  if (typeof sub !== "string" || !sub) {
    throw new Error("invalid sub");
  }
  const staffId = payload.staffId;
  const displayName = payload.displayName;
  if (typeof staffId !== "string" || typeof displayName !== "string") {
    throw new Error("invalid claims");
  }
  return { sub, staffId, displayName };
}

export { MAX_AGE_S };
