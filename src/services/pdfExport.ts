import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

import {
  getPracticeStats,
  getTodayPractice,
} from './practice';
import {
  getPeaceJournalEntries,
  type PeaceJournalEntry,
} from './peaceJournal';
import {
  getAltarPreferences,
} from './altarPreferences';

export type PdfExportSections = {
  practice: boolean;
  journal: boolean;
  altar: boolean;
};

export type PdfExportLabels = {
  reportTitle: string;
  generatedAt: string;
  practiceTitle: string;
  currentStreak: string;
  longestStreak: string;
  practiceDays: string;
  completedRituals: string;
  meditationMinutes: string;
  todayProgress: string;
  journalTitle: string;
  journalEmpty: string;
  gratitude: string;
  release: string;
  prayer: string;
  note: string;
  beforeMood: string;
  afterMood: string;
  altarTitle: string;
  sceneMode: string;
  centerpiece: string;
  flower: string;
  lamp: string;
  accent: string;
  soundscape: string;
  privacyNotice: string;
};

export type PdfExportOptions = {
  language: string;
  sections: PdfExportSections;
  labels: PdfExportLabels;
};

function escapeHtml(
  value: string,
): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(
  value: string | Date,
  language: string,
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  try {
    return new Intl.DateTimeFormat(
      language,
      {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    ).format(date);
  } catch {
    return date.toLocaleString();
  }
}

function journalEntryHtml(
  entry: PeaceJournalEntry,
  labels: PdfExportLabels,
  language: string,
): string {
  const blocks = [
    [labels.gratitude, entry.gratitude],
    [labels.release, entry.release],
    [labels.prayer, entry.prayer],
    [labels.note, entry.note],
  ]
    .filter(([, value]) =>
      Boolean(value?.trim()),
    )
    .map(
      ([label, value]) => `
        <div class="entry-block">
          <div class="entry-label">${escapeHtml(
            label,
          )}</div>
          <div class="entry-text">${escapeHtml(
            value,
          ).replace(/\n/g, '<br/>')}</div>
        </div>
      `,
    )
    .join('');

  return `
    <div class="journal-entry">
      <div class="entry-header">
        <strong>${escapeHtml(
          formatDate(
            entry.createdAt,
            language,
          ),
        )}</strong>
        <span>
          ${escapeHtml(labels.beforeMood)}:
          ${escapeHtml(entry.beforeMood)}
          &nbsp;→&nbsp;
          ${escapeHtml(labels.afterMood)}:
          ${escapeHtml(entry.afterMood)}
        </span>
      </div>
      ${blocks}
    </div>
  `;
}

export async function exportWellbeingPdf(
  options: PdfExportOptions,
): Promise<string> {
  const {
    language,
    sections,
    labels,
  } = options;

  const [
    practiceStats,
    todayPractice,
    journalEntries,
    altarPreferences,
  ] = await Promise.all([
    sections.practice
      ? getPracticeStats()
      : null,
    sections.practice
      ? getTodayPractice()
      : null,
    sections.journal
      ? getPeaceJournalEntries()
      : [],
    sections.altar
      ? getAltarPreferences()
      : null,
  ]);

  const practiceHtml =
    sections.practice &&
    practiceStats &&
    todayPractice
      ? `
      <section>
        <h2>${escapeHtml(
          labels.practiceTitle,
        )}</h2>

        <div class="stats-grid">
          <div class="stat">
            <div class="stat-value">${
              practiceStats.currentStreak
            }</div>
            <div class="stat-label">${escapeHtml(
              labels.currentStreak,
            )}</div>
          </div>

          <div class="stat">
            <div class="stat-value">${
              practiceStats.longestStreak
            }</div>
            <div class="stat-label">${escapeHtml(
              labels.longestStreak,
            )}</div>
          </div>

          <div class="stat">
            <div class="stat-value">${
              practiceStats.totalPracticeDays
            }</div>
            <div class="stat-label">${escapeHtml(
              labels.practiceDays,
            )}</div>
          </div>

          <div class="stat">
            <div class="stat-value">${
              practiceStats.totalCompletedRituals
            }</div>
            <div class="stat-label">${escapeHtml(
              labels.completedRituals,
            )}</div>
          </div>

          <div class="stat">
            <div class="stat-value">${
              practiceStats.totalMeditationMinutes
            }</div>
            <div class="stat-label">${escapeHtml(
              labels.meditationMinutes,
            )}</div>
          </div>

          <div class="stat">
            <div class="stat-value">${
              Object.values(
                todayPractice.activities,
              ).filter(Boolean).length
            }/4</div>
            <div class="stat-label">${escapeHtml(
              labels.todayProgress,
            )}</div>
          </div>
        </div>
      </section>
    `
      : '';

  const journalHtml = sections.journal
    ? `
      <section>
        <h2>${escapeHtml(
          labels.journalTitle,
        )}</h2>

        ${
          journalEntries.length === 0
            ? `<p class="muted">${escapeHtml(
                labels.journalEmpty,
              )}</p>`
            : journalEntries
                .map(entry =>
                  journalEntryHtml(
                    entry,
                    labels,
                    language,
                  ),
                )
                .join('')
        }
      </section>
    `
    : '';

  const altarHtml =
    sections.altar &&
    altarPreferences
      ? `
      <section>
        <h2>${escapeHtml(
          labels.altarTitle,
        )}</h2>

        <table>
          <tr>
            <td>${escapeHtml(
              labels.sceneMode,
            )}</td>
            <td>${escapeHtml(
              altarPreferences.sceneMode,
            )}</td>
          </tr>
          <tr>
            <td>${escapeHtml(
              labels.centerpiece,
            )}</td>
            <td>${escapeHtml(
              altarPreferences.centerpiece,
            )}</td>
          </tr>
          <tr>
            <td>${escapeHtml(
              labels.flower,
            )}</td>
            <td>${escapeHtml(
              altarPreferences.flower,
            )}</td>
          </tr>
          <tr>
            <td>${escapeHtml(
              labels.lamp,
            )}</td>
            <td>${escapeHtml(
              altarPreferences.lamp,
            )}</td>
          </tr>
          <tr>
            <td>${escapeHtml(
              labels.accent,
            )}</td>
            <td>${escapeHtml(
              altarPreferences.accent,
            )}</td>
          </tr>
          <tr>
            <td>${escapeHtml(
              labels.soundscape,
            )}</td>
            <td>${escapeHtml(
              altarPreferences.soundscape,
            )}</td>
          </tr>
        </table>
      </section>
    `
      : '';

  const html = `
    <!DOCTYPE html>
    <html lang="${escapeHtml(language)}">
      <head>
        <meta charset="utf-8" />
        <style>
          @page {
            margin: 28px;
          }

          body {
            color: #4A2A1A;
            font-family: Arial, sans-serif;
            font-size: 13px;
            line-height: 1.55;
          }

          h1 {
            color: #4A2A1A;
            font-size: 25px;
            margin: 0;
          }

          h2 {
            color: #5A351F;
            border-bottom: 1px solid #D8B77F;
            font-size: 18px;
            padding-bottom: 6px;
            margin-top: 26px;
          }

          .header {
            background: #F5E4C8;
            border: 1px solid #E1C99F;
            border-radius: 12px;
            padding: 18px;
          }

          .generated {
            color: #806A58;
            margin-top: 6px;
          }

          .stats-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }

          .stat {
            width: 29%;
            background: #FFF9EE;
            border: 1px solid #E9D8BC;
            border-radius: 10px;
            padding: 12px;
          }

          .stat-value {
            color: #4A2A1A;
            font-size: 21px;
            font-weight: bold;
          }

          .stat-label {
            color: #806A58;
            font-size: 11px;
            margin-top: 3px;
          }

          .journal-entry {
            border: 1px solid #E8D8BE;
            border-radius: 10px;
            padding: 13px;
            margin-bottom: 10px;
            page-break-inside: avoid;
          }

          .entry-header {
            display: flex;
            justify-content: space-between;
            color: #6E5847;
            font-size: 11px;
            margin-bottom: 8px;
          }

          .entry-block {
            margin-top: 8px;
          }

          .entry-label {
            color: #5A351F;
            font-weight: bold;
          }

          .entry-text {
            color: #5E4D3F;
            margin-top: 2px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          td {
            border-bottom: 1px solid #E9DDCA;
            padding: 8px 5px;
          }

          td:first-child {
            width: 42%;
            color: #7A614C;
            font-weight: bold;
          }

          .muted {
            color: #8E7C6C;
          }

          .privacy {
            color: #8A7561;
            border-top: 1px solid #E5D5BD;
            font-size: 10px;
            margin-top: 28px;
            padding-top: 10px;
          }
        </style>
      </head>

      <body>
        <div class="header">
          <h1>${escapeHtml(
            labels.reportTitle,
          )}</h1>
          <div class="generated">
            ${escapeHtml(
              labels.generatedAt,
            )}: ${escapeHtml(
              formatDate(
                new Date(),
                language,
              ),
            )}
          </div>
        </div>

        ${practiceHtml}
        ${journalHtml}
        ${altarHtml}

        <div class="privacy">
          ${escapeHtml(
            labels.privacyNotice,
          )}
        </div>
      </body>
    </html>
  `;

  const fileName = `peace-report-${Date.now()}`;

  const result =
    await RNHTMLtoPDF.convert({
      html,
      fileName,
      directory: 'Documents',
    });

  if (!result.filePath) {
    throw new Error(
      'PDF_FILE_PATH_MISSING',
    );
  }

  return result.filePath;
}

export async function sharePdf(
  filePath: string,
): Promise<void> {
  await Share.open({
    type: 'application/pdf',
    url: filePath.startsWith('file://')
      ? filePath
      : `file://${filePath}`,
    failOnCancel: false,
  });
}
