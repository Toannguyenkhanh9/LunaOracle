import React, {useCallback, useMemo, useState} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {
  deleteSavedBaziChart,
  duplicateSavedBaziChart,
  getSavedBaziCharts,
  recalculateSavedBaziChart,
  type SavedBaziRecord,
} from '../services/baziHistory';
import {shareBaziChart} from '../services/baziShare';

import {
  localizeCanChi,
} from '../utils/horoscopeValueLocalization';
import {
  localizeBaziPlaceName,
} from '../utils/baziHistoryLocalization';

export default function BaziHistoryScreen() {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<any>();
  const [records, setRecords] = useState<SavedBaziRecord[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const load = useCallback(async () => {
    try {
      setRecords(await getSavedBaziCharts());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const filtered = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase();

    if (!keyword) {
      return records;
    }

    return records.filter(item =>
      [
        item.title,
        item.notes,
        item.input.location.placeName,
        item.input.location.timeZone,
      ]
        .filter(Boolean)
        .some(value => String(value).toLocaleLowerCase().includes(keyword)),
    );
  }, [records, search]);

  const confirmDelete = (item: SavedBaziRecord) => {
    Alert.alert(
      t('bazi.stage3.deleteTitle', {defaultValue: 'Xóa lá số'}),
      t('bazi.stage3.deleteMessage', {
        defaultValue: 'Bạn có chắc muốn xóa lá số này?',
      }),
      [
        {text: t('common.cancel', {defaultValue: 'Hủy'}), style: 'cancel'},
        {
          text: t('common.delete', {defaultValue: 'Xóa'}),
          style: 'destructive',
          onPress: async () => setRecords(await deleteSavedBaziChart(item.id)),
        },
      ],
    );
  };

  const duplicate = async (item: SavedBaziRecord) => {
    await duplicateSavedBaziChart(item.id);
    await load();
  };

  const recalculate = async (item: SavedBaziRecord) => {
    try {
      await recalculateSavedBaziChart(item.id);
      await load();
      Alert.alert(
        t('bazi.stage3.recalculatedTitle', {defaultValue: 'Đã cập nhật'}),
        t('bazi.stage3.recalculatedMessage', {
          defaultValue: 'Lá số đã được tính lại bằng phiên bản engine hiện tại.',
        }),
      );
    } catch (error) {
      console.warn('Cannot recalculate saved BaZi chart:', error);
      Alert.alert(
        t('bazi.stage3.recalculateErrorTitle', {defaultValue: 'Không thể cập nhật'}),
        t('bazi.stage3.recalculateErrorMessage', {
          defaultValue: 'Hãy kiểm tra lại dữ liệu lá số.',
        }),
      );
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8EF" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <Text style={styles.headerIcon}>☯</Text>
          <Text style={styles.title}>
            {t('bazi.stage3.historyTitle', {defaultValue: 'Lá số đã lưu'})}
          </Text>
          <Text style={styles.subtitle}>
            {t('bazi.stage3.historySubtitle', {
              defaultValue: 'Xem lại, chia sẻ hoặc tính lại bằng phiên bản engine mới.',
            })}
          </Text>
        </View>

        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t('bazi.stage3.searchPlaceholder', {
              defaultValue: 'Tìm theo tên hoặc nơi sinh...',
            })}
            placeholderTextColor="#9A8572"
            style={styles.searchInput}
          />
        </View>

        {isLoading ? (
          <Text style={styles.emptyText}>
            {t('common.loading', {defaultValue: 'Đang tải...'})}
          </Text>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🪷</Text>
            <Text style={styles.emptyTitle}>
              {t('bazi.stage3.emptyHistoryTitle', {defaultValue: 'Chưa có lá số'})}
            </Text>
            <Text style={styles.emptyText}>
              {t('bazi.stage3.emptyHistoryMessage', {
                defaultValue: 'Lập một lá số rồi nhấn Lưu để xem lại tại đây.',
              })}
            </Text>
          </View>
        ) : (
          filtered.map(item => {
            const input = item.input.localDateTime;
            const pillars = [
              'year',
              'month',
              'day',
              'hour',
            ]
              .map(kind =>
                localizeCanChi(
                  item.chart.pillars[
                    kind as keyof typeof item.chart.pillars
                  ].text,
                  language,
                ),
              )
              .join('  ');

            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.meta}>
                      {String(input.day).padStart(2, '0')}/
                      {String(input.month).padStart(2, '0')}/{input.year}{'  '}
                      {String(input.hour).padStart(2, '0')}:
                      {String(input.minute).padStart(2, '0')}
                    </Text>
                  </View>

                  <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceValue}>
                      {item.chart.diagnostics?.overallScore ?? '—'}
                    </Text>
                    <Text style={styles.confidenceLabel}>/100</Text>
                  </View>
                </View>

                <Text style={styles.pillars}>{pillars}</Text>
                <Text style={styles.location}>
                  {localizeBaziPlaceName(
                    item.input.location.placeName ||
                      item.input.location.timeZone,
                    language,
                  )}
                </Text>
                <Text style={styles.version}>
                  {t('bazi.stage3.engineVersion', {defaultValue: 'Engine'})}: {item.engineVersion}
                </Text>

                <View style={styles.actionRow}>
                  <ActionButton
                    label={t('bazi.stage3.open', {defaultValue: 'Mở'})}
                    primary
                    onPress={() => navigation.navigate('BaziChart', {savedRecordId: item.id})}
                  />
                  <ActionButton
                    label={t('bazi.stage3.share', {defaultValue: 'Chia sẻ'})}
                    onPress={() =>
                      shareBaziChart(
                        item.chart,
                        language,
                      )
                    }
                  />
                  <ActionButton
                    label={t('bazi.stage3.recalculate', {defaultValue: 'Tính lại'})}
                    onPress={() => recalculate(item)}
                  />
                  <ActionButton
                    label={t('bazi.stage3.duplicate', {defaultValue: 'Nhân bản'})}
                    onPress={() => duplicate(item)}
                  />
                  <ActionButton
                    label={t('common.delete', {defaultValue: 'Xóa'})}
                    danger
                    onPress={() => confirmDelete(item)}
                  />
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionButton({
  label,
  onPress,
  primary = false,
  danger = false,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable
      style={({pressed}) => [
        styles.actionButton,
        primary && styles.actionButtonPrimary,
        danger && styles.actionButtonDanger,
        pressed && styles.pressed,
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.actionText,
          primary && styles.actionTextPrimary,
          danger && styles.actionTextDanger,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#FFF8EF'},
  content: {padding: 16, paddingBottom: 120},
  headerCard: {
    alignItems: 'center',
    backgroundColor: '#4E2C1C',
    borderWidth: 1,
    borderColor: '#D0A04C',
    borderRadius: 24,
    padding: 20,
  },
  headerIcon: {fontSize: 42},
  title: {color: '#FFE3A3', fontSize: 26, fontWeight: '900', marginTop: 6},
  subtitle: {color: '#ECD7B8', fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 7},
  searchWrap: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E5CDA8',
    borderRadius: 15,
    paddingHorizontal: 13,
    marginTop: 14,
  },
  searchIcon: {color: '#4E2C1C', fontSize: 22, marginRight: 8},
  searchInput: {flex: 1, color: '#4E2C1C', fontSize: 14},
  card: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E5CDA8',
    borderRadius: 18,
    padding: 15,
    marginTop: 12,
  },
  cardTop: {flexDirection: 'row', alignItems: 'center'},
  cardInfo: {flex: 1, marginRight: 10},
  cardTitle: {color: '#4E2C1C', fontSize: 17, fontWeight: '900'},
  meta: {color: '#806A58', fontSize: 11, marginTop: 4},
  confidenceBadge: {
    minWidth: 54,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4E2C1C',
    borderRadius: 13,
  },
  confidenceValue: {color: '#FFE3A3', fontSize: 17, fontWeight: '900'},
  confidenceLabel: {color: '#DCC59C', fontSize: 8},
  pillars: {color: '#6A3519', fontSize: 16, fontWeight: '900', marginTop: 12},
  location: {color: '#7E6857', fontSize: 11, marginTop: 5},
  version: {color: '#9A806B', fontSize: 10, marginTop: 4},
  actionRow: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 12},
  actionButton: {
    minHeight: 34,
    justifyContent: 'center',
    backgroundColor: '#F4E7D3',
    borderRadius: 10,
    paddingHorizontal: 11,
    marginRight: 7,
    marginBottom: 7,
  },
  actionButtonPrimary: {backgroundColor: '#4E2C1C'},
  actionButtonDanger: {backgroundColor: '#FFF0ED'},
  actionText: {color: '#5E4634', fontSize: 11, fontWeight: '800'},
  actionTextPrimary: {color: '#FFE3A3'},
  actionTextDanger: {color: '#B24D3D'},
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E5CDA8',
    borderRadius: 18,
    padding: 28,
    marginTop: 14,
  },
  emptyIcon: {fontSize: 40},
  emptyTitle: {color: '#4E2C1C', fontSize: 17, fontWeight: '900', marginTop: 8},
  emptyText: {color: '#806A58', fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 6},
  pressed: {opacity: 0.65, transform: [{scale: 0.985}]},
});
