// Motion and Animation tokens as per Design Specification v1.0 Section 6.2

export const ease = {
  cinematic: [0.22, 1, 0.36, 1] as const, // soft landing, default for entrances
  expo: [0.16, 1, 0.3, 1] as const,       // fast start, long settle
  inOut: [0.65, 0, 0.35, 1] as const,     // wipes, iris
  linear: [0, 0, 1, 1] as const,
};

export const dur = {
  micro: 0.15, // hover color, press
  ui: 0.3,     // menus, toasts, drawers
  reveal: 0.7, // content entrances
  scene: 1.0,  // iris, page transition
  hero: 1.4,   // hero sequence, actor world
};

export const spring = {
  soft: { type: "spring" as const, stiffness: 120, damping: 20, mass: 0.8 },
  snappy: { type: "spring" as const, stiffness: 400, damping: 30 },
};
