import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export type ExpertDetailRow = {
  label: string;
  value: string;
  code?: string;
};

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  rows: ExpertDetailRow[];
  notes?: string[];
  showRawCodes?: boolean;
};

export default function ExpertDetailsCard({
  eyebrow,
  title,
  subtitle,
  rows,
  notes = [],
  showRawCodes = false,
}: Props) {
  return (
    <View style={styles.card}>
      {!!eyebrow && (
        <Text style={styles.eyebrow}>
          {eyebrow}
        </Text>
      )}

      <Text style={styles.title}>
        {title}
      </Text>

      {!!subtitle && (
        <Text
          style={
            styles.subtitle
          }>
          {subtitle}
        </Text>
      )}

      <View style={styles.rows}>
        {rows.map(
          (
            row,
            index,
          ) => (
            <View
              key={`${row.label}-${index}`}
              style={[
                styles.row,
                index ===
                  rows.length -
                    1 &&
                  styles.rowLast,
              ]}>
              <Text
                style={
                  styles.label
                }>
                {row.label}
              </Text>

              <View
                style={
                  styles.valueWrap
                }>
                <Text
                  selectable
                  style={
                    styles.value
                  }>
                  {row.value}
                </Text>

                {showRawCodes &&
                  row.code && (
                    <Text
                      selectable
                      style={
                        styles.code
                      }>
                      {row.code}
                    </Text>
                  )}
              </View>
            </View>
          ),
        )}
      </View>

      {notes.length > 0 && (
        <View
          style={
            styles.notesCard
          }>
          {notes.map(
            (
              note,
              index,
            ) => (
              <Text
                key={`${note}-${index}`}
                style={
                  styles.note
                }>
                • {note}
              </Text>
            ),
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#17243A',
    borderWidth: 1,
    borderColor: '#34435A',
    borderRadius: 19,
    padding: 15,
    marginHorizontal: 16,
    marginTop: 13,
  },

  eyebrow: {
    color: '#D7AF5E',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  title: {
    color: '#FFF3D5',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 3,
  },

  subtitle: {
    color: '#C6CDD7',
    fontSize: 9.5,
    lineHeight: 15,
    marginTop: 5,
  },

  rows: {
    backgroundColor:
      'rgba(255,255,255,0.05)',
    borderRadius: 14,
    paddingHorizontal: 12,
    marginTop: 12,
  },

  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor:
      'rgba(255,255,255,0.12)',
    paddingVertical: 9,
  },

  rowLast: {
    borderBottomWidth: 0,
  },

  label: {
    width: '42%',
    color: '#B8C0CC',
    fontSize: 9,
    fontWeight: '800',
  },

  valueWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },

  value: {
    color: '#FFF0CA',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'right',
  },

  code: {
    color: '#93A3BA',
    fontSize: 8,
    fontFamily:
      undefined,
    textAlign: 'right',
    marginTop: 3,
  },

  notesCard: {
    backgroundColor:
      'rgba(215,175,94,0.10)',
    borderRadius: 13,
    padding: 11,
    marginTop: 11,
  },

  note: {
    color: '#D8CBAF',
    fontSize: 9,
    lineHeight: 15,
    marginBottom: 3,
  },
});
