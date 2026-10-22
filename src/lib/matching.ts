/**
 * TalentGrid India — Skill Compatibility Quotient Engine
 * Implements deterministic Jaccard set intersection & gap calculation
 */

export interface SkillFitResult {
  score: number;
  matched: string[];
  gaps: string[];
}

export function calculateSkillFit(
  candidateSkills: string[],
  requiredSkills: string[]
): SkillFitResult {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      score: 100,
      matched: [],
      gaps: []
    };
  }

  // Normalize candidate skills into a Set for O(1) lookup
  const candidateSet = new Set(
    candidateSkills.map(s => s.toLowerCase().trim()).filter(Boolean)
  );

  const matched: string[] = [];
  const gaps: string[] = [];

  for (const req of requiredSkills) {
    const normalizedReq = req.toLowerCase().trim();
    if (candidateSet.has(normalizedReq)) {
      matched.push(req);
    } else {
      gaps.push(req);
    }
  }

  const score = Math.round((matched.length / requiredSkills.length) * 100);

  return {
    score,
    matched,
    gaps
  };
}
