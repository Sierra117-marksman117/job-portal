import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateSkillFit } from '../matching.js';

describe('Skill Compatibility Engine (calculateSkillFit)', () => {
  it('should return 100% when candidate has all required skills', () => {
    const candidate = ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Docker'];
    const required = ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Docker'];

    const result = calculateSkillFit(candidate, required);
    assert.equal(result.score, 100);
    assert.deepEqual(result.matched, ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Docker']);
    assert.deepEqual(result.gaps, []);
  });

  it('should calculate partial overlap and identify skill gaps accurately', () => {
    const candidate = ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'];
    const required = ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Apache Kafka'];

    const result = calculateSkillFit(candidate, required);
    assert.equal(result.score, 80); // 4 of 5 = 80%
    assert.deepEqual(result.matched, ['Java', 'Spring Boot', 'PostgreSQL', 'Docker']);
    assert.deepEqual(result.gaps, ['Apache Kafka']);
  });

  it('should be case-insensitive and trim extraneous whitespace', () => {
    const candidate = ['  java ', 'SPRING BOOT  ', 'PostgresQL '];
    const required = ['Java', 'Spring Boot', 'PostgreSQL'];

    const result = calculateSkillFit(candidate, required);
    assert.equal(result.score, 100);
    assert.equal(result.matched.length, 3);
    assert.equal(result.gaps.length, 0);
  });

  it('should handle empty requirements gracefully', () => {
    const candidate = ['React', 'TypeScript'];
    const required: string[] = [];

    const result = calculateSkillFit(candidate, required);
    assert.equal(result.score, 100);
    assert.deepEqual(result.matched, []);
    assert.deepEqual(result.gaps, []);
  });

  it('should handle zero candidate match gracefully (0%)', () => {
    const candidate = ['Python', 'Django'];
    const required = ['Java', 'Spring Boot', 'Docker'];

    const result = calculateSkillFit(candidate, required);
    assert.equal(result.score, 0);
    assert.deepEqual(result.matched, []);
    assert.deepEqual(result.gaps, ['Java', 'Spring Boot', 'Docker']);
  });
});
