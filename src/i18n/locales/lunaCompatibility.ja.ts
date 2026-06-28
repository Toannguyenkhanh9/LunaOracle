const lunaCompatibility = {
  lunaCompatibility: {
    summary: "この占星ガイドは内省、娯楽、自己理解のためのものです {{firstSymbol}} {{firstSign}} {{secondSymbol}} {{secondSign}}。",
    elementFlow: {
      same: "この占星ガイドは内省、娯楽、自己理解のためのものです {{firstElement}} {{secondElement}}。",
      friendly: "この占星ガイドは内省、娯楽、自己理解のためのものです {{firstElement}} {{secondElement}}。",
      different: "この占星ガイドは内省、娯楽、自己理解のためのものです {{firstElement}} {{secondElement}}。",
    },
    modalityFlow: {
      same: "この占星ガイドは内省、娯楽、自己理解のためのものです {{firstModality}} {{secondModality}}。",
      different: "この占星ガイドは内省、娯楽、自己理解のためのものです {{firstModality}} {{secondModality}}。",
    },
    sections: {
      loveRhythm: {
        title: "恋愛のリズム",
        text: "この占星ガイドは内省、娯楽、自己理解のためのものです {{firstLoveStyle}} {{secondLoveStyle}}。",
      },
      communication: {
        title: "コミュニケーション",
        sameElement: "この占星ガイドは内省、娯楽、自己理解のためのものです。",
        differentElement: "この占星ガイドは内省、娯楽、自己理解のためのものです。",
      },
      growthLesson: {
        title: "成長の学び",
        text: "この占星ガイドは内省、娯楽、自己理解のためのものです。",
      },
    },
  },
} as const;

export default lunaCompatibility;
