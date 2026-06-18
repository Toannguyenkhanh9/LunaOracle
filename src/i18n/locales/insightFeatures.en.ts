const insightFeatures = {
  home: {
    eyebrow: 'LIBRARY & INSIGHTS',
    title: 'Continue your journey',
    subtitle:
      'Reopen recent content, save notes, and explore your personal timeline.',
    cards: {
      recentTitle: 'Recently Viewed',
      recentSubtitle:
        'Quickly reopen charts and tools you used recently.',
      libraryTitle: 'Bookmarks & Notes',
      librarySubtitle:
        'Save important content and add your own reflections.',
      timelineTitle: 'Visual Timeline',
      timelineSubtitle:
        'Explore year-by-year patterns for a saved profile.',
      compatibilityTitle: 'Advanced Compatibility',
      compatibilitySubtitle:
        'Compare two profiles across several relationship dimensions.',
    },
  },

  common: {
    loading: 'Loading...',
    open: 'Open',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
  },

  recent: {
    title: 'Recently Viewed',
    subtitle:
      'A history of the content you recently opened in Eastern Destiny.',
    clear: 'Clear all',
    clearTitle: 'Clear history',
    clearMessage:
      'Are you sure you want to remove all recently viewed items?',
    emptyTitle: 'No recent history',
    emptyMessage:
      'Charts, dates, and tools you open will appear here.',
    bookmark: 'Save',
    savedTitle: 'Bookmark Saved',
    savedMessage:
      'The item has been added to your personal library.',
    noticeTitle: 'Stored locally',
    notice:
      'History is stored on this device and limited to the most recent items.',
  },

  library: {
    title: 'Bookmarks & Notes',
    subtitle:
      'Build a personal library for important content and reflections.',
    newNote: 'New note',
    tabs: {
      bookmarks: 'Bookmarks',
      notes: 'Notes',
    },
    searchPlaceholder:
      'Search bookmarks and notes...',
    emptyBookmarksTitle: 'No bookmarks yet',
    emptyBookmarksMessage:
      'Save an item from Recently Viewed, Timeline, or Compatibility.',
    emptyNotesTitle: 'No notes yet',
    emptyNotesMessage:
      'Create a note for questions, observations, or plans.',
    editNote: 'Add note',
    bookmarkNoteTitle: 'Bookmark note',
    noteEditorTitle: 'Personal note',
    noteTitlePlaceholder: 'Note title',
    noteBodyPlaceholder: 'Write your note...',
    removeBookmarkTitle: 'Remove bookmark',
    removeBookmarkMessage:
      'Are you sure you want to remove this bookmark?',
    removeNoteTitle: 'Delete note',
    removeNoteMessage:
      'Are you sure you want to delete this note?',
    errorTitle: 'Unable to save',
    emptyNoteError:
      'Enter a title or note content.',
    saveError:
      'An error occurred while saving. Please try again.',
  },

  timeline: {
    title: 'Visual Timeline',
    subtitle:
      'Explore year-by-year patterns with a transparent reference model.',
    chooseProfile: 'Choose a profile',
    range: 'Time range',
    years: '{{count}} years',
    visualEyebrow: 'TIMELINE',
    visualTitle: 'Yearly pattern',
    overall: 'Overall',
    age: 'Age {{count}}',
    strengths: 'Supportive points',
    cautions: 'Points to consider',
    bookmark: 'Save this year',
    savedTitle: 'Timeline Saved',
    savedMessage:
      'The selected year was added to Bookmarks & Notes.',
    noProfileTitle: 'No profile available',
    noProfileMessage:
      'Create a birth profile to build a personal timeline.',
    createProfile: 'Create profile',
    modelTitle: 'Reference model',
    modelNotice:
      'The timeline uses birth year, branch relationships, annual elements, and stable variation to create a visual reference. It is not a certain prediction or financial, medical, or legal advice.',

    domains: {
      career: 'Career',
      wealth: 'Finances',
      relationship: 'Relationships',
      wellbeing: 'Personal balance',
    },

    elements: {
      wood: 'Wood',
      fire: 'Fire',
      earth: 'Earth',
      metal: 'Metal',
      water: 'Water',
    },

    relations: {
      sixHarmony: 'Six Harmony',
      threeHarmony: 'Three Harmony',
      sameBranch: 'Same Branch',
      supportive: 'Supportive',
      neutral: 'Neutral',
      harm: 'Harm',
      clash: 'Clash',
    },

    strengthCodes: {
      relationshipHarmony:
        'Supportive for connection and cooperation.',
      elementSupport:
        'The annual element tends to provide support.',
      momentum:
        'The year shows clearer momentum than usual.',
      steadyProgress:
        'A steady, step-by-step strategy is favored.',
    },

    cautionCodes: {
      avoidRushing:
        'Avoid rushing major choices under pressure.',
      communicationCare:
        'Review communication and expectations carefully.',
      protectEnergy:
        'Protect rest time and personal energy.',
      reviewPriorities:
        'Review priorities before expanding commitments.',
    },

    stems: {
      jia: 'Jia',
      yi: 'Yi',
      bing: 'Bing',
      ding: 'Ding',
      wu: 'Wu',
      ji: 'Ji',
      geng: 'Geng',
      xin: 'Xin',
      ren: 'Ren',
      gui: 'Gui',
    },

    branches: {
      rat: 'Rat',
      ox: 'Ox',
      tiger: 'Tiger',
      rabbit: 'Rabbit',
      dragon: 'Dragon',
      snake: 'Snake',
      horse: 'Horse',
      goat: 'Goat',
      monkey: 'Monkey',
      rooster: 'Rooster',
      dog: 'Dog',
      pig: 'Pig',
    },
  },

  compatibility: {
    title: 'Advanced Compatibility',
    subtitle:
      'Compare two profiles across multiple dimensions and relationship goals.',
    chooseProfiles: 'Choose two profiles',
    profileA: 'First profile',
    profileB: 'Second profile',
    mode: 'Relationship type',
    overall: 'Overall',
    dimensionsEyebrow: 'DETAILED ANALYSIS',
    dimensionsTitle: 'Compatibility dimensions',
    strengths: 'Strengths',
    cautions: 'Points to consider',
    suggestions: 'Growth suggestions',
    bookmark: 'Save this result',
    savedTitle: 'Compatibility Saved',
    savedMessage:
      'The result was added to Bookmarks & Notes.',
    needProfilesTitle: 'At least two profiles are required',
    needProfilesMessage:
      'Create another profile to compare compatibility.',
    createProfile: 'Create profile',
    modelTitle: 'Transparent model',
    modelNotice:
      'The result combines birth-year branch relationships, element flow, and birth-date rhythms. Scores are for reflection only and do not replace real communication or professional advice.',

    modes: {
      love: 'Love',
      marriage: 'Marriage',
      friendship: 'Friendship',
      business: 'Business',
      parentChild: 'Parent–Child',
    },

    tones: {
      strong: {
        title: 'Many supportive alignments',
        message:
          'The profiles share several supportive factors. Compatibility still grows through communication and mutual respect.',
      },
      supportive: {
        title: 'A supportive foundation',
        message:
          'Several dimensions can work well together, with some differences that need understanding.',
      },
      mixed: {
        title: 'A mix of alignment and difference',
        message:
          'The relationship can develop well when expectations are clear and different rhythms are respected.',
      },
      challenging: {
        title: 'More patience and intention are needed',
        message:
          'Some dimensions differ significantly. This does not predict failure; it highlights the need for clear communication.',
      },
    },

    dimensions: {
      elementFlow: 'Element flow',
      zodiacRelation: 'Branch relationship',
      communication: 'Communication',
      emotionalRhythm: 'Emotional rhythm',
      sharedDirection: 'Shared direction',
      longTermStability: 'Long-term stability',
    },

    codeText: {
      dimension_elementFlow:
        'The elemental relationship can provide mutual support.',
      dimension_zodiacRelation:
        'The branch relationship offers a cooperative foundation.',
      dimension_communication:
        'Communication and understanding show good potential.',
      dimension_emotionalRhythm:
        'The emotional rhythms share useful similarities.',
      dimension_sharedDirection:
        'Shared direction is relatively clear.',
      dimension_longTermStability:
        'There is potential for long-term stability.',
      generalBalance:
        'No major warning stands out, but balance still needs attention.',
      clearCommunication:
        'Agree on how to communicate during disagreement.',
      alignExpectations:
        'Clarify shared goals and expectations.',
      respectDifferentPaces:
        'Respect different emotional and decision-making rhythms.',
      maintainStrengths:
        'Continue developing the areas that already work well.',
      reviewTogether:
        'Periodically review how the relationship is functioning.',
    },
  },
};

export default insightFeatures;
