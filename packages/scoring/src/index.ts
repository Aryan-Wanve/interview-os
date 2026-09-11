export type Criterion = { id: string; name: string; weight?: number; min?: number; max?: number };
export type Submission = { judgeId: string; candidateId: string; scores: Record<string, number> };
const rounded = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function validatePanel(judgeIds: string[]) {
  if (new Set(judgeIds).size !== judgeIds.length) throw new Error("A judge may only appear once on a panel.");
  if (judgeIds.length !== 5) throw new Error("An active panel must contain exactly five judges.");
}
export function validateScores(scores: Record<string, number>, criteria: Criterion[]) {
  for (const criterion of criteria) {
    const value = scores[criterion.id]; const min = criterion.min ?? 1; const max = criterion.max ?? 10;
    if (!Number.isFinite(value) || value < min || value > max) throw new Error(`${criterion.name} must be a number from ${min} to ${max}.`);
  }
}
export function submissionOverall(submission: Submission, criteria: Criterion[]) {
  validateScores(submission.scores, criteria);
  if (new Set(criteria.map(c => c.max ?? 10)).size > 1) return rounded(criteria.reduce((sum, c) => sum + submission.scores[c.id] * (c.weight ?? 1), 0));
  const totalWeight = criteria.reduce((sum, c) => sum + (c.weight ?? 1), 0);
  return criteria.reduce((sum, c) => sum + submission.scores[c.id] * (c.weight ?? 1), 0) / totalWeight;
}
export function summarizeCandidate(submissions: Submission[], criteria: Criterion[]) {
  const overallValues = submissions.map(s => submissionOverall(s, criteria));
  const criterionAverages = Object.fromEntries(criteria.map(c => [c.id, submissions.length ? rounded(submissions.reduce((sum, s) => sum + s.scores[c.id], 0) / submissions.length) : null]));
  return { criterionAverages, overall: overallValues.length ? rounded(overallValues.reduce((a, b) => a + b, 0) / overallValues.length) : null, highest: overallValues.length ? rounded(Math.max(...overallValues)) : null, lowest: overallValues.length ? rounded(Math.min(...overallValues)) : null, completionCount: submissions.length };
}
export function rankCandidates<T extends { referenceNumber: string; name: string; overall: number | null; criterionAverage: number | null }>(items: T[]) {
  return [...items].sort((a,b) => (b.overall ?? -Infinity) - (a.overall ?? -Infinity) || (b.criterionAverage ?? -Infinity) - (a.criterionAverage ?? -Infinity) || a.referenceNumber.localeCompare(b.referenceNumber) || a.name.localeCompare(b.name)).map((item, index) => ({ ...item, rank: index + 1 }));
}
