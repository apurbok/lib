import { describe, expect, it } from 'vitest';
import { getStarFills, normalizeRating } from '../src/index';

describe('getStarFills', () => {
  it('fills fifth star to 60% for rating 4.6 on 5 stars', () => {
    const fills = getStarFills(4.6, 5);
    expect(fills).toHaveLength(5);
    expect(fills[0]).toMatchObject({ index: 1, fill: 1, fillPercent: 100 });
    expect(fills[3]).toMatchObject({ index: 4, fill: 1, fillPercent: 100 });
    expect(fills[4]).toMatchObject({ index: 5, fill: 0.6, fillPercent: 60 });
  });

  it('returns all empty stars for zero', () => {
    const fills = getStarFills(0, 5);
    expect(fills.every((s) => s.fill === 0)).toBe(true);
    expect(fills[0].fillPercent).toBe(0);
  });

  it('returns all full stars at max', () => {
    const fills = getStarFills(5, 5);
    expect(fills.every((s) => s.fill === 1)).toBe(true);
  });

  it('clamps above max to full stars', () => {
    const fills = getStarFills(99, 5);
    expect(fills.every((s) => s.fill === 1)).toBe(true);
  });

  it('clamps below zero', () => {
    const fills = getStarFills(-2, 5);
    expect(fills.every((s) => s.fill === 0)).toBe(true);
  });

  it('supports custom max', () => {
    const fills = getStarFills(2.25, 3);
    expect(fills).toHaveLength(3);
    expect(fills[2]).toMatchObject({ index: 3, fill: 0.25, fillPercent: 25 });
  });
});

describe('normalizeRating', () => {
  it('rounds to precision', () => {
    expect(normalizeRating(4.567, 5, 1)).toBe(4.6);
  });
});
