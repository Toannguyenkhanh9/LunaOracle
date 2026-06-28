const lunaCompatibility = {
  lunaCompatibility: {
    summary: "Deze astrologische gids is bedoeld voor reflectie, entertainment en zelfinzicht {{firstSymbol}} {{firstSign}} {{secondSymbol}} {{secondSign}}.",
    elementFlow: {
      same: "Deze astrologische gids is bedoeld voor reflectie, entertainment en zelfinzicht {{firstElement}} {{secondElement}}.",
      friendly: "Deze astrologische gids is bedoeld voor reflectie, entertainment en zelfinzicht {{firstElement}} {{secondElement}}.",
      different: "Deze astrologische gids is bedoeld voor reflectie, entertainment en zelfinzicht {{firstElement}} {{secondElement}}.",
    },
    modalityFlow: {
      same: "Deze astrologische gids is bedoeld voor reflectie, entertainment en zelfinzicht {{firstModality}} {{secondModality}}.",
      different: "Deze astrologische gids is bedoeld voor reflectie, entertainment en zelfinzicht {{firstModality}} {{secondModality}}.",
    },
    sections: {
      loveRhythm: {
        title: "Liefdesritme",
        text: "Deze astrologische gids is bedoeld voor reflectie, entertainment en zelfinzicht {{firstLoveStyle}} {{secondLoveStyle}}.",
      },
      communication: {
        title: "Communicatie",
        sameElement: "Deze astrologische gids is bedoeld voor reflectie, entertainment en zelfinzicht.",
        differentElement: "Deze astrologische gids is bedoeld voor reflectie, entertainment en zelfinzicht.",
      },
      growthLesson: {
        title: "Groeiles",
        text: "Deze astrologische gids is bedoeld voor reflectie, entertainment en zelfinzicht.",
      },
    },
  },
} as const;

export default lunaCompatibility;
