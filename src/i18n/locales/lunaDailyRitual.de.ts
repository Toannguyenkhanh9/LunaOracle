const lunaDailyRitual = {
  lunaDailyRitual: {
    eyebrow: "Tägliches Ritual",
    title: "Heutiger Check-in",
    subtitleFor: "For {{name}}",
    profile: "Profile",
    todayEnergy: "Today energy",
    streak: "streak",
    houseFocus: "Moon focus: House {{number}}",
    progress: "{{done}}/{{total}} complete",
    moodTitle: "How do you feel?",
    stepsTitle: "Ritual steps",
    cardTitle: "Daily card",
    actionTitle: "Today action",
    journalPromptTitle: "Journal prompt",
    notePlaceholder: "Write a short reflection...",
    save: "Save Check-in",
    saving: "Saving...",
    savedTitle: "Saved",
    savedMessage: "Your daily ritual was saved.",
    saveErrorTitle: "Unable to save",
    saveErrorMessage: "Please try again.",
    notice: "Daily ritual is for reflection and self-awareness. It should not replace professional advice.",
    homeTitle: "Tägliches Ritual",
    homeSubtitle: "Mood, daily card, action step, and reflection journal.",
    moods: {
      calm: {
        emoji: "☾",
        label: "Calm",
      },
      hopeful: {
        emoji: "✦",
        label: "Hopeful",
      },
      focused: {
        emoji: "◎",
        label: "Focused",
      },
      tired: {
        emoji: "☁",
        label: "Tired",
      },
      anxious: {
        emoji: "⚡",
        label: "Anxious",
      },
      grateful: {
        emoji: "♡",
        label: "Grateful",
      },
    },
    steps: {
      breathe: {
        title: "Breathe",
        subtitle: "Take three slow breaths before reading.",
      },
      readInsight: {
        title: "Read insight",
        subtitle: "Notice today’s Moon focus and energy score.",
      },
      drawCard: {
        title: "Draw card",
        subtitle: "Receive one tarot card for reflection.",
      },
      writeNote: {
        title: "Write note",
        subtitle: "Save one sentence about your day.",
      },
    },
  },
} as const;

export default lunaDailyRitual;
