import { describe, expect, it } from 'vitest';

import {
  canHitWumpus,
  getNextPosition,
  getSenses,
  getStenchDirection,
  gridStatusFor,
  isAdjacent,
  isSameTile,
  resolvePostDeathPhase,
  type Coord,
  type TutorialPhase,
} from './tutorial';

describe('isSameTile / isAdjacent', () => {
  it('detects the same tile', () => {
    expect(isSameTile([1, 2], [1, 2])).toBe(true);
    expect(isSameTile([1, 2], [2, 1])).toBe(false);
  });

  it('treats only orthogonal neighbours as adjacent', () => {
    expect(isAdjacent([1, 1], [1, 2])).toBe(true);
    expect(isAdjacent([1, 1], [2, 1])).toBe(true);
    expect(isAdjacent([1, 1], [2, 2])).toBe(false);
    expect(isAdjacent([1, 1], [1, 1])).toBe(false);
  });
});

describe('getStenchDirection', () => {
  it('names the unit step from the player toward the target', () => {
    const player: Coord = [6, 5];
    expect(getStenchDirection(player, [6, 4])).toBe('NORTH');
    expect(getStenchDirection(player, [6, 6])).toBe('SOUTH');
    expect(getStenchDirection(player, [7, 5])).toBe('EAST');
    expect(getStenchDirection(player, [5, 5])).toBe('WEST');
  });

  it('is null when the target is not one orthogonal step away', () => {
    expect(getStenchDirection([0, 0], [6, 5])).toBeNull();
    expect(getStenchDirection([0, 0], [1, 1])).toBeNull();
  });
});

describe('getSenses', () => {
  it('feels a breeze next to a pit', () => {
    // [3,3] borders the pit at [3,2].
    expect(getSenses([3, 3], true).breeze).toBe(true);
    expect(getSenses([0, 0], true).breeze).toBe(false);
  });

  it('reports the stench direction only while the Wumpus lives', () => {
    // Player [6,4] sits directly north of the Wumpus at [6,5].
    expect(getSenses([6, 4], true).stench_direction).toBe('SOUTH');
    expect(getSenses([6, 4], false).stench_direction).toBeNull();
  });

  it('shines when adjacent to or standing on the gold', () => {
    // Gold is at [4,8].
    expect(getSenses([4, 7], true).shine).toBe(true);
    expect(getSenses([4, 8], true).shine).toBe(true);
    expect(getSenses([0, 0], true).shine).toBe(false);
  });
});

describe('getNextPosition', () => {
  it('steps one tile in each direction', () => {
    expect(getNextPosition([5, 5], 'NORTH')).toEqual([5, 4]);
    expect(getNextPosition([5, 5], 'SOUTH')).toEqual([5, 6]);
    expect(getNextPosition([5, 5], 'EAST')).toEqual([6, 5]);
    expect(getNextPosition([5, 5], 'WEST')).toEqual([4, 5]);
  });

  it('clamps at the board edges', () => {
    expect(getNextPosition([0, 0], 'NORTH')).toEqual([0, 0]);
    expect(getNextPosition([0, 0], 'WEST')).toEqual([0, 0]);
    expect(getNextPosition([9, 9], 'SOUTH')).toEqual([9, 9]);
    expect(getNextPosition([9, 9], 'EAST')).toEqual([9, 9]);
  });
});

describe('canHitWumpus', () => {
  it('hits down the corridor the Wumpus stands in', () => {
    // Wumpus at [6,5].
    expect(canHitWumpus([6, 8], 'NORTH')).toBe(true);
    expect(canHitWumpus([6, 2], 'SOUTH')).toBe(true);
    expect(canHitWumpus([2, 5], 'EAST')).toBe(true);
    expect(canHitWumpus([9, 5], 'WEST')).toBe(true);
  });

  it('misses when off-axis or aimed the wrong way', () => {
    expect(canHitWumpus([5, 8], 'NORTH')).toBe(false);
    expect(canHitWumpus([6, 2], 'NORTH')).toBe(false);
    expect(canHitWumpus([2, 4], 'EAST')).toBe(false);
  });
});

describe('resolvePostDeathPhase', () => {
  it('resumes exploring after an early death', () => {
    expect(resolvePostDeathPhase('welcome')).toBe('exploring');
    expect(resolvePostDeathPhase('move')).toBe('exploring');
  });

  it('returns to aim after dying with the stench lesson open', () => {
    expect(resolvePostDeathPhase('stench')).toBe('aim');
  });

  it('leaves any other phase untouched', () => {
    const phases: TutorialPhase[] = ['exploring', 'aim', 'find_gold'];
    for (const phase of phases) {
      expect(resolvePostDeathPhase(phase), phase).toBe(phase);
    }
  });
});

describe('gridStatusFor', () => {
  it('maps the terminal teaching phases to board statuses', () => {
    expect(gridStatusFor('death_pit')).toBe('PlayerLost_Pit');
    expect(gridStatusFor('death_wumpus')).toBe('PlayerLost_Wumpus');
    expect(gridStatusFor('complete')).toBe('PlayerWon');
  });

  it('is Ongoing for every active phase', () => {
    const phases: TutorialPhase[] = [
      'welcome',
      'exploring',
      'aim',
      'find_gold',
    ];
    for (const phase of phases) {
      expect(gridStatusFor(phase), phase).toBe('Ongoing');
    }
  });
});
