export const EQUIPMENT_META: Record<string, { icon: string; desc: string }> = {
  barbell: { icon: "🏗️", desc: "Olympic or standard barbell" },
  dumbbell: { icon: "🏋️", desc: "Pair of dumbbells" },
  kettlebells: { icon: "🔔", desc: "One or two kettlebells" },
  machine: { icon: "⚙️", desc: "Gym machine / cable station" },
  "body only": { icon: "🤸", desc: "No equipment required" },
  bands: { icon: "🎗️", desc: "Resistance bands" },
  "e-z curl bar": { icon: "〰️", desc: "Angled curl bar" },
  cable: { icon: "🔗", desc: "Cable pulley machine" },
  "foam roll": { icon: "🔵", desc: "Foam roller" },
  "exercise ball": { icon: "⚽", desc: "Stability / Swiss ball" },
};

export const RELATED_EQUIPMENT: Record<string, string[]> = {
  barbell: [
    "Power rack or squat stand",
    "Weight plates (bumper / iron)",
    "Barbell collars",
    "Lifting belt (optional)",
    "Chalk (optional)",
  ],
  dumbbell: [
    "Adjustable bench (optional)",
    "Dumbbell rack",
    "Wrist straps (optional)",
  ],
  kettlebells: ["Chalk or grip gloves (optional)"],
  machine: ["Seat / pad adjustment pin", "Weight selector pin"],
  "body only": ["Yoga mat (optional)", "Pull-up bar (optional)"],
};
