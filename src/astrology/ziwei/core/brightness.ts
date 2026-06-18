import {PALACE_ORDER} from '../constants';
import type {
  EarthlyBranchId,
  ZiweiBrightnessSummary,
  ZiweiMainStarId,
  ZiweiMainStarPlacement,
  ZiweiMainStarsByPalace,
  ZiweiStarBrightness,
} from '../types';

type EvaluatedBrightness = Exclude<ZiweiStarBrightness, 'notEvaluated'>;
type BrightnessRow = Record<EarthlyBranchId, EvaluatedBrightness>;

const row = (
  zi: EvaluatedBrightness,
  chou: EvaluatedBrightness,
  yin: EvaluatedBrightness,
  mao: EvaluatedBrightness,
  chen: EvaluatedBrightness,
  si: EvaluatedBrightness,
  wu: EvaluatedBrightness,
  wei: EvaluatedBrightness,
  shen: EvaluatedBrightness,
  you: EvaluatedBrightness,
  xu: EvaluatedBrightness,
  hai: EvaluatedBrightness,
): BrightnessRow => ({
  zi,
  chou,
  yin,
  mao,
  chen,
  si,
  wu,
  wei,
  shen,
  you,
  xu,
  hai,
});

/**
 * Vietnamese reference table v1.
 *
 * Brightness tables differ by school. This table is deliberately isolated,
 * versioned, and surfaced through diagnostics so it can be replaced without
 * changing star-placement logic.
 */
export const MAIN_STAR_BRIGHTNESS_REFERENCE_V1: Record<
  ZiweiMainStarId,
  BrightnessRow
> = {
  ziWei: row('binh', 'dac', 'mien', 'binh', 'vuong', 'vuong', 'mien', 'mien', 'vuong', 'binh', 'dac', 'binh'),
  tianJi: row('mien', 'ham', 'dac', 'mien', 'ham', 'vuong', 'mien', 'ham', 'dac', 'mien', 'ham', 'vuong'),
  taiYang: row('ham', 'ham', 'vuong', 'mien', 'vuong', 'mien', 'mien', 'dac', 'ham', 'ham', 'ham', 'ham'),
  wuQu: row('vuong', 'mien', 'dac', 'ham', 'mien', 'dac', 'vuong', 'mien', 'dac', 'ham', 'mien', 'dac'),
  tianTong: row('vuong', 'ham', 'dac', 'mien', 'binh', 'dac', 'ham', 'ham', 'vuong', 'ham', 'binh', 'mien'),
  lianZhen: row('vuong', 'dac', 'mien', 'ham', 'mien', 'ham', 'vuong', 'dac', 'mien', 'ham', 'mien', 'ham'),
  tianFu: row('vuong', 'mien', 'mien', 'dac', 'mien', 'dac', 'vuong', 'mien', 'mien', 'dac', 'mien', 'dac'),
  taiYin: row('mien', 'mien', 'ham', 'ham', 'ham', 'ham', 'ham', 'binh', 'dac', 'vuong', 'vuong', 'mien'),
  tanLang: row('vuong', 'mien', 'dac', 'ham', 'vuong', 'ham', 'vuong', 'mien', 'dac', 'ham', 'vuong', 'ham'),
  juMen: row('vuong', 'ham', 'vuong', 'mien', 'ham', 'ham', 'vuong', 'ham', 'vuong', 'mien', 'ham', 'ham'),
  tianXiang: row('mien', 'dac', 'mien', 'ham', 'vuong', 'dac', 'mien', 'dac', 'mien', 'ham', 'vuong', 'dac'),
  tianLiang: row('mien', 'vuong', 'mien', 'mien', 'vuong', 'ham', 'mien', 'vuong', 'mien', 'mien', 'vuong', 'ham'),
  qiSha: row('vuong', 'mien', 'mien', 'ham', 'vuong', 'dac', 'mien', 'mien', 'mien', 'ham', 'vuong', 'dac'),
  poJun: row('mien', 'vuong', 'ham', 'ham', 'vuong', 'ham', 'mien', 'vuong', 'ham', 'ham', 'vuong', 'ham'),
};

export function evaluateMainStarBrightness(
  placements: ZiweiMainStarPlacement[],
): {
  placements: ZiweiMainStarPlacement[];
  byPalace: ZiweiMainStarsByPalace;
  summary: ZiweiBrightnessSummary;
} {
  const evaluated = placements.map(item => ({
    ...item,
    brightness: MAIN_STAR_BRIGHTNESS_REFERENCE_V1[item.id][item.branchId],
  }));

  const byPalace = Object.fromEntries(
    PALACE_ORDER.map(id => [id, []]),
  ) as unknown as ZiweiMainStarsByPalace;

  const byBrightness: ZiweiBrightnessSummary['byBrightness'] = {
    mien: 0,
    vuong: 0,
    dac: 0,
    binh: 0,
    ham: 0,
  };

  for (const item of evaluated) {
    byPalace[item.palaceId].push(item);
    byBrightness[item.brightness as EvaluatedBrightness] += 1;
  }

  return {
    placements: evaluated,
    byPalace,
    summary: {
      source: 'vietnamese-reference-v1',
      evaluatedCount: evaluated.length,
      byBrightness,
    },
  };
}
