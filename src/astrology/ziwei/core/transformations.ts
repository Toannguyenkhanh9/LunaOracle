import {PALACE_ORDER} from '../constants';
import type {
  HeavenlyStemId,
  ZiweiAuxiliaryStarPlacement,
  ZiweiMainStarPlacement,
  ZiweiPalaceId,
  ZiweiTransformationPlacement,
  ZiweiTransformationsByPalace,
  ZiweiTransformationType,
  ZiweiTransformableStarId,
} from '../types';

type TransformationRule = {
  type: ZiweiTransformationType;
  starId: ZiweiTransformableStarId;
};

export const FOUR_TRANSFORMATIONS_BY_YEAR_STEM: Record<
  HeavenlyStemId,
  TransformationRule[]
> = {
  jia: [
    {type: 'lu', starId: 'lianZhen'},
    {type: 'quan', starId: 'poJun'},
    {type: 'ke', starId: 'wuQu'},
    {type: 'ji', starId: 'taiYang'},
  ],
  yi: [
    {type: 'lu', starId: 'tianJi'},
    {type: 'quan', starId: 'tianLiang'},
    {type: 'ke', starId: 'ziWei'},
    {type: 'ji', starId: 'taiYin'},
  ],
  bing: [
    {type: 'lu', starId: 'tianTong'},
    {type: 'quan', starId: 'tianJi'},
    {type: 'ke', starId: 'wenChang'},
    {type: 'ji', starId: 'lianZhen'},
  ],
  ding: [
    {type: 'lu', starId: 'taiYin'},
    {type: 'quan', starId: 'tianTong'},
    {type: 'ke', starId: 'tianJi'},
    {type: 'ji', starId: 'juMen'},
  ],
  wu: [
    {type: 'lu', starId: 'tanLang'},
    {type: 'quan', starId: 'taiYin'},
    {type: 'ke', starId: 'youBi'},
    {type: 'ji', starId: 'tianJi'},
  ],
  ji: [
    {type: 'lu', starId: 'wuQu'},
    {type: 'quan', starId: 'tanLang'},
    {type: 'ke', starId: 'tianLiang'},
    {type: 'ji', starId: 'wenQu'},
  ],
  geng: [
    {type: 'lu', starId: 'taiYang'},
    {type: 'quan', starId: 'wuQu'},
    {type: 'ke', starId: 'taiYin'},
    {type: 'ji', starId: 'tianTong'},
  ],
  xin: [
    {type: 'lu', starId: 'juMen'},
    {type: 'quan', starId: 'taiYang'},
    {type: 'ke', starId: 'wenQu'},
    {type: 'ji', starId: 'wenChang'},
  ],
  ren: [
    {type: 'lu', starId: 'tianLiang'},
    {type: 'quan', starId: 'ziWei'},
    {type: 'ke', starId: 'zuoFu'},
    {type: 'ji', starId: 'wuQu'},
  ],
  gui: [
    {type: 'lu', starId: 'poJun'},
    {type: 'quan', starId: 'juMen'},
    {type: 'ke', starId: 'taiYin'},
    {type: 'ji', starId: 'tanLang'},
  ],
};

export function placeFourTransformations(
  yearStemId: HeavenlyStemId,
  mainStars: ZiweiMainStarPlacement[],
  auxiliaryStars: ZiweiAuxiliaryStarPlacement[],
): {
  placements: ZiweiTransformationPlacement[];
  byPalace: ZiweiTransformationsByPalace;
} {
  const mainMap = new Map(mainStars.map(item => [item.id, item]));
  const auxiliaryMap = new Map(auxiliaryStars.map(item => [item.id, item]));
  const rules = FOUR_TRANSFORMATIONS_BY_YEAR_STEM[yearStemId];

  const placements = rules.map(rule => {
    const main = mainMap.get(rule.starId as never);
    if (main) {
      return {
        type: rule.type,
        starId: rule.starId,
        starKind: 'main' as const,
        branchId: main.branchId,
        branchIndex: main.branchIndex,
        palaceId: main.palaceId,
        sourceYearStemId: yearStemId,
        ruleCode: `FOUR_TRANSFORMATION_${yearStemId}_${rule.type}_${rule.starId}`,
      };
    }

    const auxiliary = auxiliaryMap.get(rule.starId as never);
    if (!auxiliary) {
      throw new Error(`TRANSFORMABLE_STAR_NOT_FOUND:${rule.starId}`);
    }

    return {
      type: rule.type,
      starId: rule.starId,
      starKind: 'auxiliary' as const,
      branchId: auxiliary.branchId,
      branchIndex: auxiliary.branchIndex,
      palaceId: auxiliary.palaceId,
      sourceYearStemId: yearStemId,
      ruleCode: `FOUR_TRANSFORMATION_${yearStemId}_${rule.type}_${rule.starId}`,
    };
  });

  const byPalace = Object.fromEntries(
    PALACE_ORDER.map(id => [id, []]),
  ) as unknown as ZiweiTransformationsByPalace;

  for (const placement of placements) {
    byPalace[placement.palaceId].push(placement);
  }

  return {placements, byPalace};
}
