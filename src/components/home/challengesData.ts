import body01 from "../../../public/upper-body.png";
import body02 from "../../../public/lower-body.png";
import { StaticImageData } from "next/image";

export interface ChallengeHomeItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  desc: string;
  stats: { val: string; label: string }[];
  image: StaticImageData;
  alt: string;
  accent: string;
  accentRgb: string;
}

export const HOME_CHALLENGES: ChallengeHomeItem[] = [
  {
    id: "upper-body",
    tag: "Full Body",
    title: "FULL BODY",
    subtitle: "7×4 CHALLENGE",
    desc: "Target every muscle group. Burn fat. Build strength. 28 days to a completely transformed physique.",
    stats: [
      { val: "28", label: "Days" },
      { val: "7", label: "Workouts/wk" },
      { val: "500+", label: "Kcal/day" },
    ],
    image: body01,
    alt: "Full Body Challenge",
    accent: "var(--primary)",
    accentRgb: "244,121,32",
  },
  {
    id: "lower-body",
    tag: "Lower Body",
    title: "LOWER BODY",
    subtitle: "7×4 CHALLENGE",
    desc: "Sculpt powerful legs, glutes, and calves. Dominate your lower half in 4 intense weeks.",
    stats: [
      { val: "28", label: "Days" },
      { val: "7", label: "Workouts/wk" },
      { val: "400+", label: "Kcal/day" },
    ],
    image: body02,
    alt: "Lower Body Challenge",
    accent: "var(--danger)",
    accentRgb: "230,57,70",
  },
];
