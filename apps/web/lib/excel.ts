import * as XLSX from "xlsx";
import { db } from "@/lib/db";
import { criteriaFor } from "@/lib/event";
import { summarizeCandidate, rankCandidates, type Submission } from "@jury/scoring";
export async function exportEvent(eventId:string) {
 const event=await db.interviewEvent.findUniqueOrThrow({where:{id:eventId},include:{candidates:{include:{submissions:{include:{judge:true,scores:true,note:true}}}},panels:{include:{members:{include:{judge:true}}}}}}); const criteria=criteriaFor(event); const now=new Date().toISOString();
 const results=event.candidates.map(c=>{const submissions:Submission[]=c.submissions.map(s=>({judgeId:s.judgeId,candidateId:c.id,scores:Object.fromEntries(s.scores.map(x=>[x.criterionId,x.value]))})); const summary=summarizeCandidate(submissions,criteria); return {...c,...summary,criterionAverage:summary.overall};}); const ranked=rankCandidates(results);
 const wb=XLSX.utils.book_new(); const add=(name:string, rows:unknown[])=>XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(rows),name);
 add("Judges", (await db.judge.findMany()).map(j=>({ID:j.id,Name:j.name,Email:j.email,Phone:j.phone,Active:j.active})));
 add("Candidates",event.candidates.map(c=>({Event:event.name,Candidate:c.name,Reference:c.referenceNumber,Status:c.status})));
 add("Panels",event.panels.flatMap(p=>p.members.map(m=>({Event:event.name,Panel:p.name,Judge:m.judge.name,JudgeId:m.judgeId}))));
 add("Raw Scores",event.candidates.flatMap(c=>c.submissions.map(s=>({Event:event.name,Candidate:c.name,Reference:c.referenceNumber,Judge:s.judge.name,SubmittedAt:s.submittedAt.toISOString(),UpdatedAt:s.updatedAt.toISOString(),Note:s.note?.text??"",...Object.fromEntries(criteria.map(k=>[k.name,s.scores.find(x=>x.criterionId===k.id)?.value??""]))}))));
 add("Final Results",ranked.map(r=>({Event:event.name,Candidate:r.name,Reference:r.referenceNumber,...Object.fromEntries(criteria.map(k=>[`${k.name} Average`,r.criterionAverages[k.id]])),"Overall Average":r.overall,"Highest Score":r.highest,"Lowest Score":r.lowest,Rank:r.rank,Completion:`${r.completionCount} of 5`,ExportedAt:now})));
 return XLSX.write(wb,{type:"buffer",bookType:"xlsx"});
}
