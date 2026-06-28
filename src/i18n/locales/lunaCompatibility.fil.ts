const lunaCompatibility = {
  lunaCompatibility: {
    summary: "Ang gabay sa astrolohiya na ito ay para sa pagninilay, aliw, at pagkilala sa sarili {{firstSymbol}} {{firstSign}} {{secondSymbol}} {{secondSign}}.",
    elementFlow: {
      same: "Ang gabay sa astrolohiya na ito ay para sa pagninilay, aliw, at pagkilala sa sarili {{firstElement}} {{secondElement}}.",
      friendly: "Ang gabay sa astrolohiya na ito ay para sa pagninilay, aliw, at pagkilala sa sarili {{firstElement}} {{secondElement}}.",
      different: "Ang gabay sa astrolohiya na ito ay para sa pagninilay, aliw, at pagkilala sa sarili {{firstElement}} {{secondElement}}.",
    },
    modalityFlow: {
      same: "Ang gabay sa astrolohiya na ito ay para sa pagninilay, aliw, at pagkilala sa sarili {{firstModality}} {{secondModality}}.",
      different: "Ang gabay sa astrolohiya na ito ay para sa pagninilay, aliw, at pagkilala sa sarili {{firstModality}} {{secondModality}}.",
    },
    sections: {
      loveRhythm: {
        title: "Ritmo ng pag-ibig",
        text: "Ang gabay sa astrolohiya na ito ay para sa pagninilay, aliw, at pagkilala sa sarili {{firstLoveStyle}} {{secondLoveStyle}}.",
      },
      communication: {
        title: "Komunikasyon",
        sameElement: "Ang gabay sa astrolohiya na ito ay para sa pagninilay, aliw, at pagkilala sa sarili.",
        differentElement: "Ang gabay sa astrolohiya na ito ay para sa pagninilay, aliw, at pagkilala sa sarili.",
      },
      growthLesson: {
        title: "Aral sa paglago",
        text: "Ang gabay sa astrolohiya na ito ay para sa pagninilay, aliw, at pagkilala sa sarili.",
      },
    },
  },
} as const;

export default lunaCompatibility;
