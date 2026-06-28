const lunaCompatibility = {
  lunaCompatibility: {
    summary: "Этот астрологический материал предназначен для размышления, развлечения и самопознания {{firstSymbol}} {{firstSign}} {{secondSymbol}} {{secondSign}}.",
    elementFlow: {
      same: "Этот астрологический материал предназначен для размышления, развлечения и самопознания {{firstElement}} {{secondElement}}.",
      friendly: "Этот астрологический материал предназначен для размышления, развлечения и самопознания {{firstElement}} {{secondElement}}.",
      different: "Этот астрологический материал предназначен для размышления, развлечения и самопознания {{firstElement}} {{secondElement}}.",
    },
    modalityFlow: {
      same: "Этот астрологический материал предназначен для размышления, развлечения и самопознания {{firstModality}} {{secondModality}}.",
      different: "Этот астрологический материал предназначен для размышления, развлечения и самопознания {{firstModality}} {{secondModality}}.",
    },
    sections: {
      loveRhythm: {
        title: "Ритм любви",
        text: "Этот астрологический материал предназначен для размышления, развлечения и самопознания {{firstLoveStyle}} {{secondLoveStyle}}.",
      },
      communication: {
        title: "Общение",
        sameElement: "Этот астрологический материал предназначен для размышления, развлечения и самопознания.",
        differentElement: "Этот астрологический материал предназначен для размышления, развлечения и самопознания.",
      },
      growthLesson: {
        title: "Урок роста",
        text: "Этот астрологический материал предназначен для размышления, развлечения и самопознания.",
      },
    },
  },
} as const;

export default lunaCompatibility;
