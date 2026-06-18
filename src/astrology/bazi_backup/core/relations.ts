import {
  BREAK_PAIRS,
  HARM_PAIRS,
  MUTUAL_PUNISHMENT_PAIR,
  PUNISHMENT_GROUPS,
  SELF_PUNISHMENT_BRANCHES,
  SIX_CLASH_PAIRS,
  SIX_HARMONY_PAIRS,
  STEM_CLASHES,
  STEM_COMBINATIONS,
  THREE_HARMONY_GROUPS,
  THREE_MEETING_GROUPS,
} from '../constants';
import type {
  BranchId,
  ChartRelation,
  Pillar,
  PillarKind,
  RelationParticipant,
  StemId,
} from '../types';

const NATAL_KINDS: PillarKind[] = ['year', 'month', 'day', 'hour'];

type ParticipantLabel = PillarKind | 'luck' | 'transit';

function pairMatches<T extends string>(
  first: T,
  second: T,
  pair: [T, T],
): boolean {
  return (
    (pair[0] === first && pair[1] === second) ||
    (pair[0] === second && pair[1] === first)
  );
}

function stemParticipant(
  pillar: ParticipantLabel,
  stemId: StemId,
): RelationParticipant {
  return {pillar, stemId};
}

function branchParticipant(
  pillar: ParticipantLabel,
  branchId: BranchId,
): RelationParticipant {
  return {pillar, branchId};
}

function analyzeStemPair(
  first: Pillar,
  firstLabel: ParticipantLabel,
  second: Pillar,
  secondLabel: ParticipantLabel,
): ChartRelation[] {
  const result: ChartRelation[] = [];

  for (const [firstStem, secondStem, element] of STEM_COMBINATIONS) {
    if (pairMatches(first.stem.id, second.stem.id, [firstStem, secondStem])) {
      result.push({
        type: 'stemCombination',
        participants: [
          stemParticipant(firstLabel, first.stem.id),
          stemParticipant(secondLabel, second.stem.id),
        ],
        resultingElement: element,
        code: `stemCombination:${firstStem}:${secondStem}:${element}`,
      });
    }
  }

  for (const [firstStem, secondStem] of STEM_CLASHES) {
    if (pairMatches(first.stem.id, second.stem.id, [firstStem, secondStem])) {
      result.push({
        type: 'stemClash',
        participants: [
          stemParticipant(firstLabel, first.stem.id),
          stemParticipant(secondLabel, second.stem.id),
        ],
        code: `stemClash:${firstStem}:${secondStem}`,
      });
    }
  }

  return result;
}

function analyzeBranchPair(
  first: Pillar,
  firstLabel: ParticipantLabel,
  second: Pillar,
  secondLabel: ParticipantLabel,
): ChartRelation[] {
  const result: ChartRelation[] = [];
  const firstBranch = first.branch.id;
  const secondBranch = second.branch.id;

  for (const [a, b, element] of SIX_HARMONY_PAIRS) {
    if (pairMatches(firstBranch, secondBranch, [a, b])) {
      result.push({
        type: 'sixHarmony',
        participants: [
          branchParticipant(firstLabel, firstBranch),
          branchParticipant(secondLabel, secondBranch),
        ],
        resultingElement: element,
        code: `sixHarmony:${a}:${b}:${element}`,
      });
    }
  }

  const simplePairRelations: Array<{
    pairs: Array<[BranchId, BranchId]>;
    type: ChartRelation['type'];
    prefix: string;
  }> = [
    {pairs: SIX_CLASH_PAIRS, type: 'sixClash', prefix: 'sixClash'},
    {pairs: HARM_PAIRS, type: 'harm', prefix: 'harm'},
    {pairs: BREAK_PAIRS, type: 'break', prefix: 'break'},
    {pairs: [MUTUAL_PUNISHMENT_PAIR], type: 'punishment', prefix: 'mutualPunishment'},
  ];

  for (const definition of simplePairRelations) {
    for (const pair of definition.pairs) {
      if (pairMatches(firstBranch, secondBranch, pair)) {
        result.push({
          type: definition.type,
          participants: [
            branchParticipant(firstLabel, firstBranch),
            branchParticipant(secondLabel, secondBranch),
          ],
          code: `${definition.prefix}:${pair[0]}:${pair[1]}`,
        });
      }
    }
  }

  if (
    firstBranch === secondBranch &&
    SELF_PUNISHMENT_BRANCHES.includes(firstBranch)
  ) {
    result.push({
      type: 'selfPunishment',
      participants: [
        branchParticipant(firstLabel, firstBranch),
        branchParticipant(secondLabel, secondBranch),
      ],
      code: `selfPunishment:${firstBranch}`,
    });
  }

  return result;
}

function groupParticipants(
  pillars: Record<PillarKind, Pillar>,
  branchIds: BranchId[],
): RelationParticipant[] {
  return NATAL_KINDS.filter(kind => branchIds.includes(pillars[kind].branch.id)).map(
    kind => branchParticipant(kind, pillars[kind].branch.id),
  );
}

export function analyzeNatalRelations(
  pillars: Record<PillarKind, Pillar>,
): ChartRelation[] {
  const result: ChartRelation[] = [];

  for (let firstIndex = 0; firstIndex < NATAL_KINDS.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < NATAL_KINDS.length;
      secondIndex += 1
    ) {
      const firstKind = NATAL_KINDS[firstIndex];
      const secondKind = NATAL_KINDS[secondIndex];
      const first = pillars[firstKind];
      const second = pillars[secondKind];

      result.push(
        ...analyzeStemPair(first, firstKind, second, secondKind),
        ...analyzeBranchPair(first, firstKind, second, secondKind),
      );
    }
  }

  const branchSet = new Set(NATAL_KINDS.map(kind => pillars[kind].branch.id));

  for (const group of THREE_HARMONY_GROUPS) {
    if (group.branches.every(branch => branchSet.has(branch))) {
      result.push({
        type: 'threeHarmony',
        participants: groupParticipants(pillars, group.branches),
        resultingElement: group.element,
        code: `threeHarmony:${group.branches.join(':')}:${group.element}`,
      });
    }
  }

  for (const group of THREE_MEETING_GROUPS) {
    if (group.branches.every(branch => branchSet.has(branch))) {
      result.push({
        type: 'threeMeeting',
        participants: groupParticipants(pillars, group.branches),
        resultingElement: group.element,
        code: `threeMeeting:${group.branches.join(':')}:${group.element}`,
      });
    }
  }

  for (const group of PUNISHMENT_GROUPS) {
    if (group.every(branch => branchSet.has(branch))) {
      result.push({
        type: 'punishment',
        participants: groupParticipants(pillars, group),
        code: `threePunishment:${group.join(':')}`,
      });
    }
  }

  return result;
}

export function analyzeExternalPillarRelations(
  external: Pillar,
  label: 'luck' | 'transit',
  natal: Record<PillarKind, Pillar>,
): ChartRelation[] {
  const result: ChartRelation[] = [];

  for (const kind of NATAL_KINDS) {
    result.push(
      ...analyzeStemPair(external, label, natal[kind], kind),
      ...analyzeBranchPair(external, label, natal[kind], kind),
    );
  }

  return result;
}
