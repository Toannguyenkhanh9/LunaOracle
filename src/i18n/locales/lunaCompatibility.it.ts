const lunaCompatibility = {
  lunaCompatibility: {
    summary: "Questa guida astrologica è per riflessione, intrattenimento e consapevolezza di sé {{firstSymbol}} {{firstSign}} {{secondSymbol}} {{secondSign}}.",
    elementFlow: {
      same: "Questa guida astrologica è per riflessione, intrattenimento e consapevolezza di sé {{firstElement}} {{secondElement}}.",
      friendly: "Questa guida astrologica è per riflessione, intrattenimento e consapevolezza di sé {{firstElement}} {{secondElement}}.",
      different: "Questa guida astrologica è per riflessione, intrattenimento e consapevolezza di sé {{firstElement}} {{secondElement}}.",
    },
    modalityFlow: {
      same: "Questa guida astrologica è per riflessione, intrattenimento e consapevolezza di sé {{firstModality}} {{secondModality}}.",
      different: "Questa guida astrologica è per riflessione, intrattenimento e consapevolezza di sé {{firstModality}} {{secondModality}}.",
    },
    sections: {
      loveRhythm: {
        title: "Ritmo amoroso",
        text: "Questa guida astrologica è per riflessione, intrattenimento e consapevolezza di sé {{firstLoveStyle}} {{secondLoveStyle}}.",
      },
      communication: {
        title: "Comunicazione",
        sameElement: "Questa guida astrologica è per riflessione, intrattenimento e consapevolezza di sé.",
        differentElement: "Questa guida astrologica è per riflessione, intrattenimento e consapevolezza di sé.",
      },
      growthLesson: {
        title: "Lezione di crescita",
        text: "Questa guida astrologica è per riflessione, intrattenimento e consapevolezza di sé.",
      },
    },
  },
} as const;

export default lunaCompatibility;
