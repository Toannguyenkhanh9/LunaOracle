import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import type {BaziChart, DiagnosticSection} from '../astrology/bazi';

export default function BaziDiagnosticsCard({chart}: {chart: BaziChart}) {
  const {t} = useTranslation();
  const diagnostics = chart.diagnostics;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>
            {t('bazi.stage3.diagnosticsTitle', {
              defaultValue: 'Độ tin cậy kỹ thuật',
            })}
          </Text>

          <Text style={styles.subtitle}>
            {t('bazi.stage3.diagnosticsSubtitle', {
              defaultValue:
                'Đánh giá chất lượng dữ liệu đầu vào và độ ổn định của phép tính.',
            })}
          </Text>
        </View>

        <View style={styles.scoreBadge}>
          <Text style={styles.score}>{diagnostics.overallScore}</Text>
          <Text style={styles.scoreUnit}>/100</Text>
        </View>
      </View>

      <DiagnosticRow
        label={t('bazi.stage3.timeConfidence', {defaultValue: 'Ngày giờ và múi giờ'})}
        section={diagnostics.time}
      />
      <DiagnosticRow
        label={t('bazi.stage3.pillarConfidence', {defaultValue: 'Tứ trụ'})}
        section={diagnostics.pillars}
      />
      <DiagnosticRow
        label={t('bazi.stage3.luckConfidence', {defaultValue: 'Đại vận'})}
        section={diagnostics.luck}
      />
      <DiagnosticRow
        label={t('bazi.stage3.interpretationConfidence', {defaultValue: 'Luận giải'})}
        section={diagnostics.interpretation}
      />

      {diagnostics.codes.length > 0 && (
        <View style={styles.noticeBox}>
          {diagnostics.codes.map(code => (
            <Text key={code} style={styles.noticeText}>
              • {t(`bazi.stage3.diagnosticCodes.${code}`, {defaultValue: code})}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

function DiagnosticRow({label, section}: {label: string; section: DiagnosticSection}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowTop}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{section.score}/100</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, {width: `${Math.max(0, Math.min(100, section.score))}%`}]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E5CDA8',
    borderRadius: 18,
    padding: 15,
    marginTop: 16,
  },
  headerRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  title: {color: '#4E2C1C', fontSize: 17, fontWeight: '900'},
  subtitle: {maxWidth: 250, color: '#806A58', fontSize: 11, lineHeight: 17, marginTop: 4},
  scoreBadge: {
    minWidth: 63,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4E2C1C',
    borderRadius: 15,
    marginLeft: 10,
  },
  score: {color: '#FFE3A3', fontSize: 21, fontWeight: '900'},
  scoreUnit: {color: '#E8CE9F', fontSize: 9},
  row: {marginTop: 14},
  rowTop: {flexDirection: 'row', justifyContent: 'space-between'},
  rowLabel: {color: '#604533', fontSize: 12, fontWeight: '800'},
  rowValue: {color: '#806A58', fontSize: 11, fontWeight: '700'},
  track: {height: 8, backgroundColor: '#EADFD1', borderRadius: 4, marginTop: 6, overflow: 'hidden'},
  fill: {height: '100%', backgroundColor: '#C99551', borderRadius: 4},
  noticeBox: {backgroundColor: '#FFF3D9', borderRadius: 13, padding: 11, marginTop: 14},
  noticeText: {color: '#715843', fontSize: 10, lineHeight: 16, marginBottom: 2},
});
