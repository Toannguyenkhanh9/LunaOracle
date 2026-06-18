import {Share} from 'react-native';

import type {BaziChart, Element, PillarKind} from '../astrology/bazi';

const PILLAR_ORDER: PillarKind[] = ['year', 'month', 'day', 'hour'];

function elementLabel(element: Element, language: string): string {
  const vi: Record<Element, string> = {
    wood: 'Mộc',
    fire: 'Hỏa',
    earth: 'Thổ',
    metal: 'Kim',
    water: 'Thủy',
  };

  return language.toLowerCase().startsWith('vi') ? vi[element] : element;
}

export function buildBaziShareText(chart: BaziChart, language = 'en'): string {
  const vi = language.toLowerCase().startsWith('vi');
  const input = chart.input.localDateTime;
  const title = chart.input.displayName || (vi ? 'Lá số Bát tự' : 'BaZi Chart');
  const pillars = PILLAR_ORDER.map(kind => chart.pillars[kind].text).join(' | ');
  const favorable = chart.usefulElements.favorable
    .map(item => elementLabel(item, language))
    .join(', ');

  return [
    title,
    `${String(input.day).padStart(2, '0')}/${String(input.month).padStart(
      2,
      '0',
    )}/${input.year} ${String(input.hour).padStart(2, '0')}:${String(
      input.minute,
    ).padStart(2, '0')}`,
    '',
    vi ? `Tứ trụ: ${pillars}` : `Four Pillars: ${pillars}`,
    vi
      ? `Nhật chủ: ${chart.dayMaster.vi} ${chart.dayMaster.han}`
      : `Day Master: ${chart.dayMaster.en} ${chart.dayMaster.han}`,
    vi
      ? `Ngũ hành thuận lợi: ${favorable || '—'}`
      : `Favorable elements: ${favorable || '—'}`,
    vi
      ? `Độ tin cậy kỹ thuật: ${chart.diagnostics?.overallScore ?? '—'}/100`
      : `Technical confidence: ${chart.diagnostics?.overallScore ?? '—'}/100`,
    '',
    vi
      ? 'Nội dung chỉ dùng để tham khảo văn hóa và chiêm nghiệm.'
      : 'For cultural reference and personal reflection only.',
  ].join('\n');
}

export async function shareBaziChart(
  chart: BaziChart,
  language?: string,
): Promise<void> {
  await Share.share({
    title: chart.input.displayName || 'BaZi Chart',
    message: buildBaziShareText(chart, language),
  });
}
