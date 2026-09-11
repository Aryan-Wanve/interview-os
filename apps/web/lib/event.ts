import { CandidateStatus, EventStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { tokenHash } from "@/lib/security";
import type { Criterion } from "@jury/scoring";
export const criteriaFor = (event:{criteriaJson:string}) => JSON.parse(event.criteriaJson) as Criterion[];
export async function inviteForToken(token:string) { return db.judgeInvite.findFirst({where:{tokenHash:tokenHash(token),active:true,expiresAt:{gt:new Date()}},include:{judge:true,panel:{include:{event:{include:{candidates:true}}}}}}); }
export function scoringOpen(eventStatus:EventStatus, candidateStatus:CandidateStatus) { return eventStatus !== "LOCKED" && candidateStatus !== "LOCKED"; }
