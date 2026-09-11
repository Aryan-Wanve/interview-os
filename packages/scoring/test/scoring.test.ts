import { describe, expect, it } from "vitest";
import { rankCandidates, submissionOverall, summarizeCandidate, validatePanel } from "../src";
const criteria = [{ id: "a", name: "A", weight: 2 }, { id: "b", name: "B", weight: 1 }];
describe("scoring", () => {
 it("calculates weighted and candidate averages", () => { const s = [{ judgeId:"j1",candidateId:"c",scores:{a:9,b:6} },{ judgeId:"j2",candidateId:"c",scores:{a:6,b:9} }]; expect(submissionOverall(s[0],criteria)).toBe(8); expect(summarizeCandidate(s,criteria)).toMatchObject({overall:7.5, completionCount:2, criterionAverages:{a:7.5,b:7.5}}); });
 it("requires an exact unique panel", () => { expect(() => validatePanel(["1","2","3","4"])).toThrow(); expect(() => validatePanel(["1","2","3","4","4"])).toThrow(); expect(() => validatePanel(["1","2","3","4","5"])).not.toThrow(); });
 it("ranks deterministic ties", () => expect(rankCandidates([{name:"B",referenceNumber:"2",overall:8,criterionAverage:8},{name:"A",referenceNumber:"1",overall:8,criterionAverage:8}])[0].name).toBe("A"));
});
