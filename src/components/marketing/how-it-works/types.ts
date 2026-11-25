export interface Feature {
  label: string;
  sub: string;
  details: string[];
}

export interface Highlight {
  icon: string;
  title: string;
  text: string;
  stats: { val: string; label: string }[];
}

export interface RoleData {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  verb: string;
  description: string;
  color: string;
  features: Feature[];
  highlight: Highlight;
}
