const lunaCompatibility = {
  lunaCompatibility: {
    summary: "{{firstSymbol}} {{firstSign}} và {{secondSymbol}} {{secondSign}} có thể xây dựng kết nối thông qua sự thấu hiểu về nguyên tố, tính chất và cách giao tiếp.",
    elementFlow: {
      same: "{{firstElement}} + {{secondElement}}: hai người có ngôn ngữ cảm xúc khá quen thuộc và dễ nhận ra.",
      friendly: "{{firstElement}} + {{secondElement}}: hai nguyên tố có thể hỗ trợ nhau khi cả hai giữ sự chân thật.",
      different: "{{firstElement}} + {{secondElement}}: nhịp điệu khác nhau, vì vậy cần kiên nhẫn và học cách hiểu nhau.",
    },
    modalityFlow: {
      same: "{{firstModality}} + {{secondModality}}: cả hai có cách bắt nhịp khá giống nhau, nhưng cũng dễ phản chiếu thói quen của nhau.",
      different: "{{firstModality}} + {{secondModality}}: mối liên kết này tốt hơn khi biết cân bằng giữa khởi xướng, ổn định và linh hoạt.",
    },
    sections: {
      loveRhythm: {
        title: "Nhịp tình yêu",
        text: "{{firstLoveStyle}} {{secondLoveStyle}} Mối quan hệ sẽ tốt hơn khi tình cảm được thể hiện theo cách cả hai đều hiểu được.",
      },
      communication: {
        title: "Giao tiếp",
        sameElement: "Hai cung này thường hiểu nhau khá nhanh, nhưng vẫn cần nói rõ thay vì tự suy đoán.",
        differentElement: "Sự khác biệt nguyên tố có thể tạo sức hút, nhưng lời nói rõ ràng sẽ giúp tránh hiểu lầm.",
      },
      growthLesson: {
        title: "Bài học phát triển",
        text: "Hãy xem điểm số như công cụ chiêm nghiệm, không phải kết luận cố định. Nhận thức, thời điểm, sự chân thật và hành động thực tế quan trọng hơn việc hợp cung.",
      },
    },
  },
} as const;

export default lunaCompatibility;
