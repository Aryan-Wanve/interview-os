import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { newToken, tokenHash } from "@/lib/security";
const cookieName = "jury_judge_session";
const expiryHours = 8;
export async function currentJudgeSession() { const token = (await cookies()).get(cookieName)?.value; if (!token) return null; return db.judgeSession.findFirst({ where: { tokenHash: tokenHash(token), active: true, expiresAt: { gt: new Date() } }, include: { judge: true } }); }
export async function claimJudge(judgeId: string) { const judge = await db.judge.findFirst({ where: { id: judgeId, active: true } }); if (!judge) throw new Error("That judge is not available."); const existing = await db.judgeSession.findUnique({ where: { judgeId } }); if (existing?.active && existing.expiresAt > new Date()) throw new Error(`${judge.name} is already using a scoring session.`); const token = newToken(); await db.judgeSession.upsert({ where: { judgeId }, create: { judgeId, tokenHash: tokenHash(token), expiresAt: new Date(Date.now() + expiryHours * 3600_000) }, update: { tokenHash: tokenHash(token), active: true, panelId: null, expiresAt: new Date(Date.now() + expiryHours * 3600_000) } }); (await cookies()).set(cookieName, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: expiryHours * 3600 }); }
export async function releaseJudgeSession() { const session = await currentJudgeSession(); if (session) await db.judgeSession.update({ where: { id: session.id }, data: { active: false } }); (await cookies()).delete(cookieName); }
