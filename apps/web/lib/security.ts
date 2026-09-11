import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
export const tokenHash = (token:string) => createHash("sha256").update(token).digest("hex");
export const newToken = () => randomBytes(32).toString("base64url");
const key=()=>createHash("sha256").update(process.env.ADMIN_SESSION_SECRET??"development-only-secret").digest();
export function encryptToken(token:string){const iv=randomBytes(12),cipher=createCipheriv("aes-256-gcm",key(),iv);const encrypted=Buffer.concat([cipher.update(token,"utf8"),cipher.final()]);return `${iv.toString("base64url")}.${cipher.getAuthTag().toString("base64url")}.${encrypted.toString("base64url")}`}
export function decryptToken(value:string){const [iv,tag,data]=value.split(".").map(x=>Buffer.from(x,"base64url"));const decipher=createDecipheriv("aes-256-gcm",key(),iv);decipher.setAuthTag(tag);return Buffer.concat([decipher.update(data),decipher.final()]).toString("utf8")}
