import { PrismaClient } from "@prisma/client";
import { encryptToken, newToken, tokenHash } from "../lib/security";
const prisma = new PrismaClient();
const criteria = ["Communication", "Technical Skills", "Problem Solving", "Experience Relevance", "Overall Recommendation"].map((name, index) => ({ id: `criterion-${index + 1}`, name, weight: 1, min: 1, max: 10 }));
async function main() {
  await prisma.auditLog.deleteMany(); await prisma.criterionScore.deleteMany(); await prisma.judgeNote.deleteMany(); await prisma.scoreSubmission.deleteMany(); await prisma.judgeInvite.deleteMany(); await prisma.panelMember.deleteMany(); await prisma.panel.deleteMany(); await prisma.candidate.deleteMany(); await prisma.interviewEvent.deleteMany(); await prisma.judge.deleteMany();
  const judges = await Promise.all(Array.from({length:15}, (_, i) => prisma.judge.create({data:{name:`Judge ${String(i+1).padStart(2,"0")}`, email:`judge${i+1}@example.test`, active:true}})));
  const event = await prisma.interviewEvent.create({data:{name:"Autumn Engineering Interviews",date:new Date("2026-10-15"),status:"ACTIVE",criteriaJson:JSON.stringify(criteria)}});
  const candidates = await Promise.all(["Avery Patel","Jordan Kim","Morgan Silva"].map((name, i) => prisma.candidate.create({data:{eventId:event.id,name,referenceNumber:`ENG-00${i+1}`}})));
  const panel = await prisma.panel.create({data:{eventId:event.id,name:"Primary Jury"}});
  await prisma.panelMember.createMany({data:judges.slice(0,5).map(j => ({panelId:panel.id,judgeId:j.id}))});
  for (const judge of judges.slice(0,5)) { const token=newToken(); await prisma.judgeInvite.create({data:{panelId:panel.id,judgeId:judge.id,tokenHash:tokenHash(token),tokenEncrypted:encryptToken(token),expiresAt:new Date("2027-01-01")}}); console.log(`Judge ${judge.name}: /judge/${token}`); }
  for (let j=0;j<3;j++) for (let c=0;c<2;c++) { const submission=await prisma.scoreSubmission.create({data:{eventId:event.id,candidateId:candidates[c].id,judgeId:judges[j].id}}); await prisma.criterionScore.createMany({data:criteria.map((criterion, i)=>({submissionId:submission.id,criterionId:criterion.id,value:6+((i+j+c)%4)}))}); }
  await prisma.auditLog.create({data:{actor:"seed",action:"SEEDED",entity:"InterviewEvent",entityId:event.id}});
}
main().finally(()=>prisma.$disconnect());
