import React, {
  useCallback,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import LunaShareButton
  from '../components/LunaShareButton';

import {
  RELATIONSHIP_EVENT_TYPES,
  deleteRelationshipEvent,
  getRelationshipTimelineDashboard,
  saveRelationshipEvent,
  type RelationshipEvent,
  type RelationshipEventType,
  type RelationshipInsight,
} from '../services/relationshipTimeline';

export default function RelationshipTimelineScreen() {
  const {t} =
    useTranslation();

  const [
    events,
    setEvents,
  ] =
    useState<RelationshipEvent[]>([]);

  const [
    insight,
    setInsight,
  ] =
    useState<RelationshipInsight | undefined>();

  const [
    type,
    setType,
  ] =
    useState<RelationshipEventType>('conversation');

  const [
    title,
    setTitle,
  ] =
    useState('');

  const [
    note,
    setNote,
  ] =
    useState('');

  const [
    intensity,
    setIntensity,
  ] =
    useState(60);

  const load = useCallback(
    async () => {
      const dashboard =
        await getRelationshipTimelineDashboard();

      setEvents(
        dashboard.events,
      );
      setInsight(
        dashboard.insight,
      );
    },
    [],
  );

  useFocusEffect(
    useCallback(
      () => {
        void load();
      },
      [load],
    ),
  );

  const save = async () => {
    await saveRelationshipEvent({
      type,
      title,
      note,
      intensity,
    });

    setTitle('');
    setNote('');
    setIntensity(60);
    await load();
  };

  const remove =
    (id: string) => {
      Alert.alert(
        t(
          'relationshipTimeline.deleteTitle',
          {
            defaultValue:
              'Delete event?',
          },
        ),
        t(
          'relationshipTimeline.deleteMessage',
          {
            defaultValue:
              'This relationship event will be removed.',
          },
        ),
        [
          {
            text:
              t('common.cancel', {
                defaultValue: 'Cancel',
              }),
            style: 'cancel',
          },
          {
            text:
              t('common.delete', {
                defaultValue: 'Delete',
              }),
            style: 'destructive',
            onPress:
              async () => {
                await deleteRelationshipEvent(
                  id,
                );
                await load();
              },
          },
        ],
      );
    };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'relationshipTimeline.eyebrow',
            {
              defaultValue:
                'Relationship',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'relationshipTimeline.title',
            {
              defaultValue:
                'Relationship Timeline',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'relationshipTimeline.subtitle',
            {
              defaultValue:
                'Track meaningful relationship moments and notice repeating emotional patterns.',
            },
          )}
        </Text>

        {insight ? (
          <View style={styles.insightCard}>
            <Text style={styles.insightKicker}>
              {t(
                'relationshipTimeline.pattern',
                {
                  defaultValue:
                    'Pattern',
                },
              )}
            </Text>

            <Text style={styles.insightTitle}>
              {insight.averageIntensity}
            </Text>

            <Text style={styles.insightText}>
              {t(
                insight.themeKey,
                {
                  defaultValue:
                    insight.themeFallback,
                },
              )}
            </Text>

            <View style={styles.statsRow}>
              <Stat
                label={t(
                  'relationshipTimeline.events',
                  {
                    defaultValue:
                      'Events',
                  },
                )}
                value={`${insight.totalEvents}`}
              />

              <Stat
                label={t(
                  'relationshipTimeline.conflicts',
                  {
                    defaultValue:
                      'Conflict',
                  },
                )}
                value={`${insight.conflictCount}`}
              />

              <Stat
                label={t(
                  'relationshipTimeline.talks',
                  {
                    defaultValue:
                      'Talks',
                  },
                )}
                value={`${insight.conversationCount}`}
              />
            </View>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {t(
              'relationshipTimeline.addEvent',
              {
                defaultValue:
                  'Add event',
              },
            )}
          </Text>

          <View style={styles.chipRow}>
            {RELATIONSHIP_EVENT_TYPES.map(item => (
              <Pressable
                key={item}
                style={[
                  styles.chip,
                  type === item &&
                    styles.chipActive,
                ]}
                onPress={() =>
                  setType(item)
                }>
                <Text
                  style={[
                    styles.chipText,
                    type === item &&
                      styles.chipTextActive,
                  ]}>
                  {t(
                    `relationshipTimeline.types.${item}`,
                    {
                      defaultValue:
                        item,
                    },
                  )}
                </Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder={t(
              'relationshipTimeline.titlePlaceholder',
              {
                defaultValue:
                  'Event title...',
              },
            )}
            placeholderTextColor="#A99DAF"
            style={styles.input}
          />

          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder={t(
              'relationshipTimeline.notePlaceholder',
              {
                defaultValue:
                  'What happened?',
              },
            )}
            placeholderTextColor="#A99DAF"
            multiline
            style={styles.textArea}
          />

          <Text style={styles.intensityLabel}>
            {t(
              'relationshipTimeline.intensity',
              {
                defaultValue:
                  'Intensity',
              },
            )}
            : {intensity}
          </Text>

          <View style={styles.intensityRow}>
            {[30, 50, 70, 90].map(value => (
              <Pressable
                key={value}
                style={[
                  styles.intensityButton,
                  intensity === value &&
                    styles.intensityButtonActive,
                ]}
                onPress={() =>
                  setIntensity(value)
                }>
                <Text
                  style={[
                    styles.intensityText,
                    intensity === value &&
                      styles.intensityTextActive,
                  ]}>
                  {value}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={styles.saveButton}
            onPress={save}>
            <Text style={styles.saveText}>
              {t(
                'relationshipTimeline.save',
                {
                  defaultValue:
                    'Save Event',
                },
              )}
            </Text>
          </Pressable>
        </View>

        {insight ? (
          <LunaShareButton
            data={{
              variant: 'love',
              title:
                t(
                  'relationshipTimeline.title',
                  {
                    defaultValue:
                      'Relationship Timeline',
                  },
                ),
              subtitle:
                t(
                  'relationshipTimeline.pattern',
                  {
                    defaultValue:
                      'Pattern',
                  },
                ),
              message:
                t(
                  insight.themeKey,
                  {
                    defaultValue:
                      insight.themeFallback,
                  },
                ),
              score:
                insight.averageIntensity,
              badge: 'LOVE',
              tags: [
                'relationship',
                'timeline',
                'luna',
              ],
            }}
          />
        ) : null}

        <Text style={styles.sectionTitle}>
          {t(
            'relationshipTimeline.timeline',
            {
              defaultValue:
                'Timeline',
            },
          )}
        </Text>

        {events.map(event => (
          <View
            key={event.id}
            style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <View>
                <Text style={styles.eventTitle}>
                  {event.title}
                </Text>

                <Text style={styles.eventMeta}>
                  {event.date} •{' '}
                  {t(
                    `relationshipTimeline.types.${event.type}`,
                    {
                      defaultValue:
                        event.type,
                    },
                  )}
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  remove(event.id)
                }>
                <Text style={styles.deleteText}>
                  ×
                </Text>
              </Pressable>
            </View>

            {event.note ? (
              <Text style={styles.eventNote}>
                {event.note}
              </Text>
            ) : null}

            <Text style={styles.eventIntensity}>
              {t(
                'relationshipTimeline.intensity',
                {
                  defaultValue:
                    'Intensity',
                },
              )}
              : {event.intensity}
            </Text>
          </View>
        ))}

        <Text style={styles.notice}>
          {t(
            'relationshipTimeline.notice',
            {
              defaultValue:
                'Relationship Timeline is for reflection and communication, not control or certainty.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

const COLORS = {
  cream: '#F7F2EA',
  paper: '#FFFDF8',
  border: '#E9DCC5',
  night: '#1B1537',
  purple: '#6E4DA8',
  gold: '#D9B76E',
  rose: '#B7477C',
  text: '#282236',
  muted: '#756D7D',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  content: {
    padding: 18,
    paddingBottom: 110,
  },

  eyebrow: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  title: {
    color: COLORS.text,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '900',
    marginTop: 5,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 16,
  },

  insightCard: {
    backgroundColor: COLORS.night,
    borderRadius: 28,
    padding: 18,
  },

  insightKicker: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },

  insightTitle: {
    color: '#FFF8EA',
    fontSize: 50,
    fontWeight: '900',
    marginTop: 4,
  },

  insightText: {
    color: '#DCD2F3',
    fontSize: 12,
    lineHeight: 19,
    fontWeight: '800',
    marginTop: 6,
  },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginTop: 13,
  },

  stat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 10,
    marginHorizontal: 4,
  },

  statValue: {
    color: '#FFF8EA',
    fontSize: 19,
    fontWeight: '900',
  },

  statLabel: {
    color: '#BEB3DD',
    fontSize: 8,
    fontWeight: '900',
    marginTop: 3,
    textTransform: 'uppercase',
  },

  card: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 15,
    marginTop: 14,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 20,
    marginBottom: 12,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },

  chip: {
    backgroundColor: '#EEE6F4',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: 4,
    marginBottom: 8,
  },

  chipActive: {
    backgroundColor: COLORS.night,
  },

  chipText: {
    color: COLORS.purple,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  chipTextActive: {
    color: '#F8EBCB',
  },

  input: {
    minHeight: 48,
    backgroundColor: '#F7F2EA',
    borderRadius: 16,
    color: COLORS.text,
    paddingHorizontal: 13,
    marginTop: 8,
  },

  textArea: {
    minHeight: 90,
    backgroundColor: '#F7F2EA',
    borderRadius: 16,
    color: COLORS.text,
    padding: 13,
    textAlignVertical: 'top',
    marginTop: 10,
  },

  intensityLabel: {
    color: COLORS.purple,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 12,
  },

  intensityRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginTop: 8,
  },

  intensityButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#EEE6F4',
    borderRadius: 14,
    paddingVertical: 10,
    marginHorizontal: 4,
  },

  intensityButtonActive: {
    backgroundColor: COLORS.night,
  },

  intensityText: {
    color: COLORS.purple,
    fontWeight: '900',
  },

  intensityTextActive: {
    color: '#F8EBCB',
  },

  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    backgroundColor: COLORS.gold,
    borderRadius: 17,
    marginTop: 12,
  },

  saveText: {
    color: COLORS.night,
    fontSize: 13,
    fontWeight: '900',
  },

  eventCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 14,
    marginBottom: 10,
  },

  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  eventTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
  },

  eventMeta: {
    color: COLORS.purple,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 3,
    textTransform: 'capitalize',
  },

  deleteText: {
    color: COLORS.muted,
    fontSize: 24,
    fontWeight: '900',
    marginLeft: 'auto',
  },

  eventNote: {
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },

  eventIntensity: {
    color: COLORS.rose,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 8,
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 14,
  },
});
