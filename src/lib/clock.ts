/** Shared simulation clock. Mutated in the R3F frame loop, never per-frame React state. */
export const clock = {
  years: 0,
};

/** Seconds of real time for one Earth orbit at 1× speed. */
export const YEAR_DURATION = 22;
