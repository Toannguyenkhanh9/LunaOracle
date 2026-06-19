const lunaDailyInsight = {
  lunaDailyInsight: {
    eyebrow: "Today",
    title: "Daily Personalized Insight",
    todayFor: "For {{name}} • {{date}}",
    manageProfile: "Profile",
    moonFocus: "Moon focus",
    energyScore: "Energy",
    houseLabel: "House {{number}}",
    focusScores: "Focus scores",
    skyToday: "Sky today",
    dominantTransitElement: "Dominant transit element: {{element}}",
    natalTouchpoints: "Natal touchpoints",
    noTouchpoints: "No exact major transit touches today. Keep the day simple and observe subtle patterns.",
    suggestedAction: "Suggested action",
    journalPrompt: "Journal prompt",
    orb: "orb {{value}}°",
    notice: "Daily insight is for reflection and self-awareness. It should not replace professional advice.",
    focus: {
      love: "Love",
      career: "Career",
      money: "Money",
      wellness: "Wellness",
    },
    points: {
      sun: "Sun",
      moon: "Moon",
      mercury: "Mercury",
      venus: "Venus",
      mars: "Mars",
      jupiter: "Jupiter",
      saturn: "Saturn",
      uranus: "Uranus",
      neptune: "Neptune",
      pluto: "Pluto",
      ascendant: "Rising",
      midheaven: "Midheaven",
    },
    aspectNames: {
      conjunction: "conjunction",
      sextile: "sextile",
      square: "square",
      trine: "trine",
      opposition: "opposition",
    },
    tones: {
      supportive: "supportive",
      challenging: "challenging",
      intense: "intense",
      reflective: "reflective",
    },
    aspectTexts: {
      supportive: "This transit can make today feel smoother if you actively receive the support available.",
      challenging: "This transit may create friction, but it can also show where a pattern needs attention.",
      intense: "This transit can feel concentrated. Keep your reaction conscious and choose one clear response.",
      reflective: "This transit is subtle. Notice the theme without forcing a conclusion.",
    },
    moonPhases: {
      newMoon: {
        title: "New Moon",
        text: "Begin quietly. Set one intention before asking for visible progress.",
      },
      waxingCrescent: {
        title: "Waxing Crescent",
        text: "Support a new intention with one small and repeatable action.",
      },
      firstQuarter: {
        title: "First Quarter",
        text: "Choose action over hesitation. Solve one practical obstacle.",
      },
      waxingGibbous: {
        title: "Waxing Gibbous",
        text: "Refine the plan, adjust details, and keep building patiently.",
      },
      fullMoon: {
        title: "Full Moon",
        text: "Let insight become visible. Name what is complete and what needs release.",
      },
      waningGibbous: {
        title: "Waning Gibbous",
        text: "Share wisdom, give thanks, and learn from what recently unfolded.",
      },
      lastQuarter: {
        title: "Last Quarter",
        text: "Clear clutter and choose what deserves to continue.",
      },
      waningCrescent: {
        title: "Waning Crescent",
        text: "Rest, reduce pressure, and prepare for a new inner cycle.",
      },
    },
    themes: {
      house1: {
        text: "The Moon highlights identity, body, and personal presence. Lead the day by checking what your energy truly needs.",
      },
      house2: {
        text: "The Moon highlights money, values, and stability. Make one grounded choice around resources or self-worth.",
      },
      house3: {
        text: "The Moon highlights communication, learning, and short exchanges. Say one thing clearly and listen carefully.",
      },
      house4: {
        text: "The Moon highlights home, roots, and emotional safety. Create one pocket of peace around your private life.",
      },
      house5: {
        text: "The Moon highlights creativity, romance, and joy. Let play or affection soften the day.",
      },
      house6: {
        text: "The Moon highlights routines, work, and wellbeing. Improve one small habit instead of fixing everything.",
      },
      house7: {
        text: "The Moon highlights partnerships and mirrors. Choose honest connection over quiet assumptions.",
      },
      house8: {
        text: "The Moon highlights trust, depth, and shared resources. Move slowly with sensitive topics.",
      },
      house9: {
        text: "The Moon highlights meaning, study, and wider horizons. Let one new perspective change the tone of the day.",
      },
      house10: {
        text: "The Moon highlights career, visibility, and responsibility. Put your effort where it can be seen and measured.",
      },
      house11: {
        text: "The Moon highlights friends, community, and future plans. Reach out to one supportive person or group.",
      },
      house12: {
        text: "The Moon highlights rest, closure, and the unconscious. Protect quiet time and listen to subtle signals.",
      },
    },
    actions: {
      organizeEnergy: "Organize your energy before organizing your schedule.",
      moneyCareerFocus: "Choose one practical task that supports money, work, or long-term security.",
      relationshipCheck: "Check in with someone honestly, without needing to control the response.",
      quietReset: "Take a quiet reset and remove one source of emotional noise.",
      observePattern: "Observe one repeating pattern and write down what it is teaching you.",
    },
    prompts: {
      innerCheck: "What does my inner world need before I make external decisions?",
      practicalStep: "What is one practical step that would make today feel more stable?",
      connection: "Where can I create more honest connection today?",
      release: "What am I ready to release, simplify, or stop carrying?",
    },
  },
} as const;

export default lunaDailyInsight;
