const lunaDynamic = {
  lunaDynamic: {
    daily: {
      headlines: {
        "0": "A calm choice today creates more space than a dramatic move.",
        "1": "Your intuition is useful, but facts still need a seat at the table.",
        "2": "A small conversation can clear a larger emotional knot.",
        "3": "Focus on one priority and let the rest become background noise.",
        "4": "A practical plan turns inspiration into movement.",
        "5": "Protect your energy before promising more than you can give.",
      },
      love: {
        "0": "Choose honest warmth over guessing games.",
        "1": "A gentle message can soften distance.",
        "2": "Listen for what is not being said.",
        "3": "Small consistency matters more than grand words.",
        "4": "Give affection without losing your boundaries.",
      },
      career: {
        "0": "Review the details before committing.",
        "1": "A focused hour can solve what a scattered day cannot.",
        "2": "Ask for clarity instead of carrying confusion.",
        "3": "Your next step is simpler than the whole plan.",
        "4": "Build quietly and let the results speak.",
      },
      money: {
        "0": "Avoid emotional spending and choose one practical improvement.",
        "1": "Check subscriptions, small leaks, and repeated costs.",
        "2": "A careful decision now prevents cleanup later.",
        "3": "Think long-term value rather than quick comfort.",
      },
      energy: {
        "0": "Move slowly and breathe before responding.",
        "1": "Your mind needs less noise and more structure.",
        "2": "Take a short reset before the next task.",
        "3": "Protect your sleep and hydration.",
      },
      affirmation: "I honor my {{element}} nature while choosing a grounded next step.",
    },
    compatibility: {
      headlines: {
        excellent: "Natural chemistry with strong mutual understanding.",
        strong: "A supportive match with good long-term potential.",
        balanced: "A workable connection that grows through communication.",
        growth: "A learning connection that needs patience and clear boundaries.",
      },
    },
    zodiac: {
      aries: {
        loveStyle: "Passionate, honest, and action-oriented.",
        careerStyle: "Thrives when leading, initiating, and moving quickly.",
        strengths: {
          brave: "Brave",
          direct: "Direct",
          energetic: "Energetic",
        },
        challenges: {
          impatient: "Impatient",
          reactive: "Reactive",
          restless: "Restless",
        },
      },
      taurus: {
        loveStyle: "Loyal, sensual, and consistent.",
        careerStyle: "Works best with stability, craft, resources, and long-term value.",
        strengths: {
          steady: "Steady",
          loyal: "Loyal",
          grounded: "Grounded",
        },
        challenges: {
          stubborn: "Stubborn",
          "slow to change": "Slow to change",
          "comfort-bound": "Comfort-bound",
        },
      },
      gemini: {
        loveStyle: "Playful, conversational, and mentally engaged.",
        careerStyle: "Thrives in communication, learning, sales, media, and variety.",
        strengths: {
          curious: "Curious",
          adaptable: "Adaptable",
          communicative: "Communicative",
        },
        challenges: {
          scattered: "Scattered",
          restless: "Restless",
          overthinking: "Overthinking",
        },
      },
      cancer: {
        loveStyle: "Emotionally deep, nurturing, and protective.",
        careerStyle: "Works well in care, home, food, family, support, and memory-based work.",
        strengths: {
          caring: "Caring",
          intuitive: "Intuitive",
          protective: "Protective",
        },
        challenges: {
          moody: "Moody",
          guarded: "Guarded",
          overprotective: "Overprotective",
        },
      },
      leo: {
        loveStyle: "Generous, expressive, and devoted when appreciated.",
        careerStyle: "Thrives in creative leadership, performance, branding, and visibility.",
        strengths: {
          confident: "Confident",
          warm: "Warm",
          creative: "Creative",
        },
        challenges: {
          prideful: "Prideful",
          dramatic: "Dramatic",
          "attention-seeking": "Attention-seeking",
        },
      },
      virgo: {
        loveStyle: "Shows love through care, reliability, and thoughtful details.",
        careerStyle: "Excels in analysis, health, systems, editing, operations, and service.",
        strengths: {
          precise: "Precise",
          helpful: "Helpful",
          practical: "Practical",
        },
        challenges: {
          critical: "Critical",
          anxious: "Anxious",
          perfectionist: "Perfectionist",
        },
      },
      libra: {
        loveStyle: "Romantic, balanced, and partnership-oriented.",
        careerStyle: "Thrives in design, law, mediation, beauty, relationships, and public roles.",
        strengths: {
          diplomatic: "Diplomatic",
          fair: "Fair",
          charming: "Charming",
        },
        challenges: {
          indecisive: "Indecisive",
          "people-pleasing": "People-pleasing",
          avoidant: "Avoidant",
        },
      },
      scorpio: {
        loveStyle: "Deep, committed, and emotionally intense.",
        careerStyle: "Works well with research, crisis, psychology, finance, healing, and transformation.",
        strengths: {
          intense: "Intense",
          loyal: "Loyal",
          transformative: "Transformative",
        },
        challenges: {
          secretive: "Secretive",
          possessive: "Possessive",
          "all-or-nothing": "All-or-nothing",
        },
      },
      sagittarius: {
        loveStyle: "Free-spirited, honest, and growth-oriented.",
        careerStyle: "Thrives in teaching, travel, publishing, philosophy, marketing, and exploration.",
        strengths: {
          optimistic: "Optimistic",
          adventurous: "Adventurous",
          "truth-seeking": "Truth-seeking",
        },
        challenges: {
          blunt: "Blunt",
          impatient: "Impatient",
          overpromising: "Overpromising",
        },
      },
      capricorn: {
        loveStyle: "Serious, loyal, and commitment-oriented.",
        careerStyle: "Excels in management, structure, long-term goals, business, and authority.",
        strengths: {
          disciplined: "Disciplined",
          ambitious: "Ambitious",
          responsible: "Responsible",
        },
        challenges: {
          rigid: "Rigid",
          "work-focused": "Work-focused",
          "self-critical": "Self-critical",
        },
      },
      aquarius: {
        loveStyle: "Friendship-based, open-minded, and independent.",
        careerStyle: "Thrives in technology, systems, social change, communities, and innovation.",
        strengths: {
          original: "Original",
          independent: "Independent",
          humanitarian: "Humanitarian",
        },
        challenges: {
          detached: "Detached",
          unpredictable: "Unpredictable",
          stubborn: "Stubborn",
        },
      },
      pisces: {
        loveStyle: "Tender, intuitive, romantic, and emotionally porous.",
        careerStyle: "Works well in art, healing, spirituality, music, film, care, and imagination.",
        strengths: {
          compassionate: "Compassionate",
          imaginative: "Imaginative",
          spiritual: "Spiritual",
        },
        challenges: {
          escapist: "Escapist",
          "unclear boundaries": "Unclear boundaries",
          overabsorbing: "Overabsorbing",
        },
      },
    },
    tarotCards: {
      fool: {
        name: "The Fool",
        upright: "A fresh start asks for openness, curiosity, and a lighter heart.",
        reversed: "Pause before leaping. Freedom still needs awareness.",
        advice: "Begin, but keep your eyes open.",
      },
      magician: {
        name: "The Magician",
        upright: "You already have useful tools. Bring attention and action together.",
        reversed: "Energy may be scattered or used without clear intention.",
        advice: "Choose one intention and act on it deliberately.",
      },
      "high-priestess": {
        name: "The High Priestess",
        upright: "The answer may be quiet. Listen before explaining.",
        reversed: "You may be ignoring your inner knowing or confusing fear with intuition.",
        advice: "Make space for silence before deciding.",
      },
      empress: {
        name: "The Empress",
        upright: "Growth comes through care, patience, and nourishment.",
        reversed: "Overgiving or neglecting your needs can drain the source.",
        advice: "Feed what you want to grow.",
      },
      emperor: {
        name: "The Emperor",
        upright: "Clear boundaries and steady structure create safety.",
        reversed: "Control may be too rigid or responsibility may be avoided.",
        advice: "Create order without losing warmth.",
      },
      lovers: {
        name: "The Lovers",
        upright: "A meaningful choice should align with your values, not just desire.",
        reversed: "Mixed signals or divided values need honest conversation.",
        advice: "Choose what your whole self can stand behind.",
      },
      strength: {
        name: "Strength",
        upright: "Gentle courage is stronger than force today.",
        reversed: "Self-doubt or pressure may be louder than your real strength.",
        advice: "Respond softly without abandoning your power.",
      },
      hermit: {
        name: "The Hermit",
        upright: "Step back to hear your own guidance clearly.",
        reversed: "Isolation may be turning into avoidance.",
        advice: "Seek quiet, not disappearance.",
      },
      "wheel-of-fortune": {
        name: "Wheel of Fortune",
        upright: "A cycle is turning. Adaptability matters more than control.",
        reversed: "Resistance to change may make the transition harder.",
        advice: "Move with the turn, then choose your direction.",
      },
      death: {
        name: "Death",
        upright: "An ending clears the path for a more honest beginning.",
        reversed: "Something outdated may be kept alive through fear.",
        advice: "Release what no longer carries life.",
      },
      temperance: {
        name: "Temperance",
        upright: "Blend patience with action. Healing happens through rhythm.",
        reversed: "Extremes may be pulling you away from center.",
        advice: "Choose moderation before momentum.",
      },
      star: {
        name: "The Star",
        upright: "Hope returns when you reconnect with what is true and simple.",
        reversed: "You may need rest before inspiration can return.",
        advice: "Let a small hope become a daily practice.",
      },
      moon: {
        name: "The Moon",
        upright: "Not everything is clear yet. Move carefully through uncertainty.",
        reversed: "Confusion begins to lift when you name what you fear.",
        advice: "Do not rush to certainty. Look for patterns.",
      },
      sun: {
        name: "The Sun",
        upright: "Clarity and warmth can open what felt complicated.",
        reversed: "Joy may be available, but you may need to let it in.",
        advice: "Choose the path that brings honest light.",
      },
    },
    glossaryTerms: {
      "sun-sign": {
        term: "Sun Sign",
        short: "Your core zodiac identity based on the Sun.",
        description: "The Sun Sign represents vitality, identity, confidence, and the way a person expresses their essential self.",
      },
      "moon-sign": {
        term: "Moon Sign",
        short: "Your emotional nature and inner world.",
        description: "The Moon Sign describes emotional needs, instincts, memory, comfort, and how a person responds when they feel safe or vulnerable.",
      },
      "rising-sign": {
        term: "Rising Sign",
        short: "The style you show when meeting life.",
        description: "Also called the Ascendant, the Rising Sign describes first impressions, appearance, approach to life, and the doorway into the birth chart.",
      },
      mercury: {
        term: "Mercury",
        short: "Communication, thought, learning, and messages.",
        description: "Mercury represents language, logic, study, trade, writing, speaking, and how the mind organizes information.",
      },
      venus: {
        term: "Venus",
        short: "Love, beauty, attraction, and values.",
        description: "Venus describes affection, aesthetics, money values, pleasure, relationship style, and what a person finds beautiful or desirable.",
      },
      mars: {
        term: "Mars",
        short: "Action, desire, courage, and conflict.",
        description: "Mars represents energy, drive, assertion, anger, sexuality, motivation, and the way a person goes after what they want.",
      },
    },
  },
} as const;

export default lunaDynamic;
