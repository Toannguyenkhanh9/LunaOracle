import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type {
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useTranslation,
} from 'react-i18next';

import type {
  RootTabParamList,
} from '../navigation/RootNavigator';

import {
  getBookmarks,
  getPersonalNotes,
  removeBookmark,
  removePersonalNote,
  savePersonalNote,
  updateBookmarkNote,
  type BookmarkItem,
  type PersonalNote,
} from '../services/bookmarksNotes';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'BookmarksNotes'
>;

type ActiveTab =
  | 'bookmarks'
  | 'notes';

type EditorState =
  | {
      kind: 'bookmark';
      id: string;
      title: string;
      body: string;
    }
  | {
      kind: 'note';
      id?: string;
      title: string;
      body: string;
    }
  | null;

function formatDate(
  value: string,
  language: string,
): string {
  try {
    return new Intl.DateTimeFormat(
      language,
      {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    ).format(new Date(value));
  } catch {
    return value;
  }
}

export default function BookmarksNotesScreen({
  navigation,
}: Props) {
  const {t, i18n} =
    useTranslation();

  const [activeTab, setActiveTab] =
    useState<ActiveTab>(
      'bookmarks',
    );

  const [bookmarks, setBookmarks] =
    useState<BookmarkItem[]>([]);

  const [notes, setNotes] =
    useState<PersonalNote[]>([]);

  const [query, setQuery] =
    useState('');

  const [editor, setEditor] =
    useState<EditorState>(null);

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const load = useCallback(async () => {
    try {
      const [
        nextBookmarks,
        nextNotes,
      ] = await Promise.all([
        getBookmarks(),
        getPersonalNotes(),
      ]);

      setBookmarks(
        nextBookmarks,
      );

      setNotes(
        nextNotes,
      );
    } catch (error) {
      console.warn(
        'Unable to load bookmarks and notes:',
        error,
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const filteredBookmarks =
    useMemo(() => {
      const normalized =
        query.trim().toLowerCase();

      if (!normalized) {
        return bookmarks;
      }

      return bookmarks.filter(
        item =>
          [
            String(
              t(item.titleKey),
            ),
            item.profileName ?? '',
            item.note,
          ]
            .join(' ')
            .toLowerCase()
            .includes(normalized),
      );
    }, [bookmarks, query, t]);

  const filteredNotes =
    useMemo(() => {
      const normalized =
        query.trim().toLowerCase();

      if (!normalized) {
        return notes;
      }

      return notes.filter(
        item =>
          [
            item.title,
            item.body,
          ]
            .join(' ')
            .toLowerCase()
            .includes(normalized),
      );
    }, [notes, query]);

  const openBookmark = (
    item: BookmarkItem,
  ) => {
    const nav =
      navigation as any;

    if (item.params) {
      nav.navigate(
        item.route,
        item.params,
      );
      return;
    }

    nav.navigate(
      item.route,
    );
  };

  const saveEditor = async () => {
    if (!editor) {
      return;
    }

    try {
      if (
        editor.kind ===
        'bookmark'
      ) {
        setBookmarks(
          await updateBookmarkNote(
            editor.id,
            editor.body,
          ),
        );
      } else {
        await savePersonalNote({
          id: editor.id,
          title:
            editor.title,
          body:
            editor.body,
        });

        setNotes(
          await getPersonalNotes(),
        );
      }

      setEditor(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '';

      Alert.alert(
        t(
          'insightFeatures.library.errorTitle',
        ),
        message === 'EMPTY_NOTE'
          ? t(
              'insightFeatures.library.emptyNoteError',
            )
          : t(
              'insightFeatures.library.saveError',
            ),
      );
    }
  };

  const confirmRemoveBookmark = (
    item: BookmarkItem,
  ) => {
    Alert.alert(
      t(
        'insightFeatures.library.removeBookmarkTitle',
      ),
      t(
        'insightFeatures.library.removeBookmarkMessage',
      ),
      [
        {
          text: t(
            'insightFeatures.common.cancel',
          ),
          style: 'cancel',
        },
        {
          text: t(
            'insightFeatures.common.delete',
          ),
          style: 'destructive',
          onPress: async () => {
            setBookmarks(
              await removeBookmark(
                item.id,
              ),
            );
          },
        },
      ],
    );
  };

  const confirmRemoveNote = (
    item: PersonalNote,
  ) => {
    Alert.alert(
      t(
        'insightFeatures.library.removeNoteTitle',
      ),
      t(
        'insightFeatures.library.removeNoteMessage',
      ),
      [
        {
          text: t(
            'insightFeatures.common.cancel',
          ),
          style: 'cancel',
        },
        {
          text: t(
            'insightFeatures.common.delete',
          ),
          style: 'destructive',
          onPress: async () => {
            setNotes(
              await removePersonalNote(
                item.id,
              ),
            );
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={styles.screen}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.navy
        }
      />

      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerEyebrow}>
              EASTERN DESTINY
            </Text>

            <Text style={styles.headerTitle}>
              {t(
                'insightFeatures.library.title',
              )}
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }>
              {t(
                'insightFeatures.library.subtitle',
              )}
            </Text>
          </View>

          <Pressable
            style={({pressed}) => [
              styles.addNoteButton,
              pressed &&
                styles.pressed,
            ]}
            onPress={() =>
              setEditor({
                kind: 'note',
                title: '',
                body: '',
              })
            }>
            <Text
              style={
                styles.addNoteButtonText
              }>
              ＋{' '}
              {t(
                'insightFeatures.library.newNote',
              )}
            </Text>
          </Pressable>
        </View>

        <View style={styles.tabs}>
          {(
            [
              'bookmarks',
              'notes',
            ] as ActiveTab[]
          ).map(tab => (
            <Pressable
              key={tab}
              style={[
                styles.tabButton,
                activeTab ===
                  tab &&
                  styles.tabButtonActive,
              ]}
              onPress={() =>
                setActiveTab(tab)
              }>
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab ===
                    tab &&
                    styles.tabButtonTextActive,
                ]}>
                {t(
                  `insightFeatures.library.tabs.${tab}`,
                )}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }>
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>
            ⌕
          </Text>

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t(
              'insightFeatures.library.searchPlaceholder',
            )}
            placeholderTextColor="#8A8B89"
            style={styles.searchInput}
          />

          {!!query && (
            <Pressable
              onPress={() =>
                setQuery('')
              }>
              <Text
                style={
                  styles.clearSearch
                }>
                ×
              </Text>
            </Pressable>
          )}
        </View>

        {activeTab ===
        'bookmarks' ? (
          filteredBookmarks.length ===
          0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>
                ☆
              </Text>

              <Text style={styles.emptyTitle}>
                {t(
                  'insightFeatures.library.emptyBookmarksTitle',
                )}
              </Text>

              <Text style={styles.emptyText}>
                {t(
                  'insightFeatures.library.emptyBookmarksMessage',
                )}
              </Text>
            </View>
          ) : (
            filteredBookmarks.map(
              item => (
                <View
                  key={item.id}
                  style={
                    styles.libraryCard
                  }>
                  <View
                    style={
                      styles.libraryCardHeader
                    }>
                    <View
                      style={
                        styles.iconWrap
                      }>
                      <Text
                        style={
                          styles.iconText
                        }>
                        {item.icon}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.libraryCardTitleWrap
                      }>
                      <Text
                        style={
                          styles.libraryCardTitle
                        }>
                        {t(
                          item.titleKey,
                        )}
                      </Text>

                      {!!item.profileName && (
                        <Text
                          style={
                            styles.profileName
                          }>
                          {
                            item.profileName
                          }
                        </Text>
                      )}

                      <Text
                        style={
                          styles.updatedAt
                        }>
                        {formatDate(
                          item.updatedAt,
                          language,
                        )}
                      </Text>
                    </View>
                  </View>

                  {!!item.note && (
                    <View
                      style={
                        styles.notePreview
                      }>
                      <Text
                        style={
                          styles.notePreviewText
                        }>
                        {item.note}
                      </Text>
                    </View>
                  )}

                  <View
                    style={
                      styles.cardActions
                    }>
                    <Pressable
                      style={({pressed}) => [
                        styles.primaryAction,
                        pressed &&
                          styles.pressed,
                      ]}
                      onPress={() =>
                        openBookmark(
                          item,
                        )
                      }>
                      <Text
                        style={
                          styles.primaryActionText
                        }>
                        {t(
                          'insightFeatures.common.open',
                        )}
                      </Text>
                    </Pressable>

                    <Pressable
                      style={({pressed}) => [
                        styles.secondaryAction,
                        pressed &&
                          styles.pressed,
                      ]}
                      onPress={() =>
                        setEditor({
                          kind: 'bookmark',
                          id: item.id,
                          title: String(
                            t(
                              item.titleKey,
                            ),
                          ),
                          body:
                            item.note,
                        })
                      }>
                      <Text
                        style={
                          styles.secondaryActionText
                        }>
                        {t(
                          'insightFeatures.library.editNote',
                        )}
                      </Text>
                    </Pressable>

                    <Pressable
                      style={
                        styles.deleteAction
                      }
                      onPress={() =>
                        confirmRemoveBookmark(
                          item,
                        )
                      }>
                      <Text
                        style={
                          styles.deleteActionText
                        }>
                        ×
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ),
            )
          )
        ) : filteredNotes.length ===
          0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              ✎
            </Text>

            <Text style={styles.emptyTitle}>
              {t(
                'insightFeatures.library.emptyNotesTitle',
              )}
            </Text>

            <Text style={styles.emptyText}>
              {t(
                'insightFeatures.library.emptyNotesMessage',
              )}
            </Text>
          </View>
        ) : (
          filteredNotes.map(item => (
            <View
              key={item.id}
              style={
                styles.libraryCard
              }>
              <Text
                style={
                  styles.noteTitle
                }>
                {item.title}
              </Text>

              <Text
                style={
                  styles.noteBody
                }
                numberOfLines={6}>
                {item.body}
              </Text>

              <Text
                style={
                  styles.updatedAt
                }>
                {formatDate(
                  item.updatedAt,
                  language,
                )}
              </Text>

              <View
                style={
                  styles.cardActions
                }>
                <Pressable
                  style={({pressed}) => [
                    styles.secondaryAction,
                    pressed &&
                      styles.pressed,
                  ]}
                  onPress={() =>
                    setEditor({
                      kind: 'note',
                      id: item.id,
                      title:
                        item.title,
                      body:
                        item.body,
                    })
                  }>
                  <Text
                    style={
                      styles.secondaryActionText
                    }>
                    {t(
                      'insightFeatures.common.edit',
                    )}
                  </Text>
                </Pressable>

                <Pressable
                  style={
                    styles.deleteAction
                  }
                  onPress={() =>
                    confirmRemoveNote(
                      item,
                    )
                  }>
                  <Text
                    style={
                      styles.deleteActionText
                    }>
                    ×
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={editor !== null}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setEditor(null)
        }>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editor?.kind ===
              'bookmark'
                ? t(
                    'insightFeatures.library.bookmarkNoteTitle',
                  )
                : t(
                    'insightFeatures.library.noteEditorTitle',
                  )}
            </Text>

            {editor?.kind ===
              'note' && (
              <TextInput
                value={editor.title}
                onChangeText={value =>
                  setEditor({
                    ...editor,
                    title: value,
                  })
                }
                placeholder={t(
                  'insightFeatures.library.noteTitlePlaceholder',
                )}
                placeholderTextColor="#8A8B89"
                style={styles.titleInput}
              />
            )}

            <TextInput
              value={
                editor?.body ?? ''
              }
              onChangeText={value => {
                if (!editor) {
                  return;
                }

                setEditor({
                  ...editor,
                  body: value,
                });
              }}
              multiline
              textAlignVertical="top"
              placeholder={t(
                'insightFeatures.library.noteBodyPlaceholder',
              )}
              placeholderTextColor="#8A8B89"
              style={styles.bodyInput}
            />

            <View
              style={
                styles.modalActions
              }>
              <Pressable
                style={
                  styles.modalCancel
                }
                onPress={() =>
                  setEditor(null)
                }>
                <Text
                  style={
                    styles.modalCancelText
                  }>
                  {t(
                    'insightFeatures.common.cancel',
                  )}
                </Text>
              </Pressable>

              <Pressable
                style={
                  styles.modalSave
                }
                onPress={saveEditor}>
                <Text
                  style={
                    styles.modalSaveText
                  }>
                  {t(
                    'insightFeatures.common.save',
                  )}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const COLORS = {
  navy: '#17243A',
  gold: '#D7AF5E',
  cream: '#F7F2E8',
  surface: '#FFFDF8',
  text: '#282D36',
  muted: '#6C726F',
  border: '#E2D7C5',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor:
      COLORS.cream,
  },

  header: {
    backgroundColor:
      COLORS.navy,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerTextWrap: {
    flex: 1,
    marginRight: 12,
  },

  headerEyebrow: {
    color: '#D5B672',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  headerTitle: {
    color: '#FFF7E5',
    fontSize: 27,
    fontWeight: '900',
    marginTop: 3,
  },

  headerSubtitle: {
    color: '#C8CFD9',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },

  addNoteButton: {
    backgroundColor:
      COLORS.gold,
    borderRadius: 13,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },

  addNoteButtonText: {
    color: COLORS.navy,
    fontSize: 9,
    fontWeight: '900',
  },

  tabs: {
    flexDirection: 'row',
    backgroundColor:
      'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 4,
    marginTop: 15,
  },

  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    borderRadius: 10,
  },

  tabButtonActive: {
    backgroundColor:
      COLORS.gold,
  },

  tabButtonText: {
    color: '#D7DCE4',
    fontSize: 10,
    fontWeight: '800',
  },

  tabButtonTextActive: {
    color: COLORS.navy,
  },

  content: {
    padding: 16,
    paddingBottom: 145,
  },

  searchWrap: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 15,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  searchIcon: {
    color: '#7B7166',
    fontSize: 21,
    marginRight: 7,
  },

  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 12,
  },

  clearSearch: {
    color: '#7A736C',
    fontSize: 20,
  },

  libraryCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 19,
    padding: 14,
    marginBottom: 11,
  },

  libraryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E1D5',
    borderRadius: 14,
  },

  iconText: {
    color: COLORS.navy,
    fontSize: 21,
    fontWeight: '900',
  },

  libraryCardTitleWrap: {
    flex: 1,
    marginLeft: 11,
  },

  libraryCardTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
  },

  profileName: {
    color: '#96703A',
    fontSize: 9.5,
    fontWeight: '800',
    marginTop: 3,
  },

  updatedAt: {
    color: COLORS.muted,
    fontSize: 8.5,
    marginTop: 5,
  },

  notePreview: {
    backgroundColor: '#F4EEE5',
    borderRadius: 12,
    padding: 10,
    marginTop: 11,
  },

  notePreviewText: {
    color: '#5E5953',
    fontSize: 10,
    lineHeight: 16,
  },

  noteTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '900',
  },

  noteBody: {
    color: COLORS.muted,
    fontSize: 10.5,
    lineHeight: 17,
    marginTop: 7,
  },

  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  primaryAction: {
    backgroundColor:
      COLORS.navy,
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },

  primaryActionText: {
    color: '#FFF1D0',
    fontSize: 9,
    fontWeight: '900',
  },

  secondaryAction: {
    backgroundColor: '#F0E7D8',
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 9,
    marginLeft: 8,
  },

  secondaryActionText: {
    color: '#75572B',
    fontSize: 9,
    fontWeight: '900',
  },

  deleteAction: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },

  deleteActionText: {
    color: '#A05A51',
    fontSize: 20,
  },

  emptyCard: {
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 20,
    padding: 28,
  },

  emptyIcon: {
    color: '#B28C49',
    fontSize: 36,
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 8,
  },

  emptyText: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 6,
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor:
      'rgba(12,17,27,0.58)',
    padding: 18,
  },

  modalCard: {
    backgroundColor:
      COLORS.surface,
    borderRadius: 22,
    padding: 17,
  },

  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
  },

  titleInput: {
    minHeight: 48,
    color: COLORS.text,
    backgroundColor: '#F4EEE5',
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 13,
    paddingHorizontal: 12,
    marginTop: 13,
  },

  bodyInput: {
    minHeight: 160,
    color: COLORS.text,
    backgroundColor: '#F4EEE5',
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 13,
    padding: 12,
    marginTop: 12,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14,
  },

  modalCancel: {
    borderRadius: 11,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  modalCancelText: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '900',
  },

  modalSave: {
    backgroundColor:
      COLORS.gold,
    borderRadius: 11,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 8,
  },

  modalSaveText: {
    color: COLORS.navy,
    fontSize: 10,
    fontWeight: '900',
  },

  pressed: {
    opacity: 0.72,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },
});
