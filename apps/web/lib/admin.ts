import { cookies } from "next/headers";
const key="jury_admin";
export async function isAdmin() { return (await cookies()).get(key)?.value === process.env.ADMIN_SESSION_SECRET; }
export async function requireAdmin() { if (!(await isAdmin())) throw new Error("Unauthorized"); }
export async function setAdminSession() { (await cookies()).set(key, process.env.ADMIN_SESSION_SECRET ?? "dev", {httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV === "production",path:"/"}); }
