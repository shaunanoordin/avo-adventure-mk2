export const SHORT_KEYPRESS_DURATION = 1;

export const MODES = {
  INITIALISING: 'initialising',
  ACTION: 'action',
  INTERACTION: 'interaction',
};

export const SHAPES = {
  NONE: 'none',
  CIRCLE: 'circle',
  SQUARE: 'square',
  POLYGON: 'polygon',
};

export const ROTATIONS = {
  EAST: 0,
  SOUTHEAST: Math.PI * 0.25,
  SOUTH: Math.PI * 0.5,
  SOUTHWEST: Math.PI * 0.75,
  WEST: Math.PI,
  NORTHWEST: Math.PI * -0.75,
  NORTH: Math.PI * -0.5,
  NORTHEAST: Math.PI * -0.25,
};

export const DIRECTIONS = {
  EAST: 0,
  SOUTH: 1,
  WEST: 2,
  NORTH: 3,
};

export const ACTION_TYPES = {
  IDLE: 'idle',  // Default. Loops.
  CONTINUOUS: 'continuous',  // Requires continuous input (e.g. moving). Loops until cancelled (e.g. user stops pressing arrow keys) or interrupted (e.g. by taking damage and going into the knockback state).
  STANDARD: 'standard',  // Actions that play out all their steps. Cannot be cancelled by new user input. Can be interrupted.
  SPECIAL_ONCE: 'special once',  // Actions that play out all their steps. Cannot be cancelled nor interrupted, except by story scripts.
  SPECIAL_FOREVER: 'special forever',  // Actions that play in a loop. Cannot be cancelled nor interrupted, except by story scripts.
};

/*
Stacking Rules determine what happens when a Particle's Effect payload is
applied to an object that already has the same Effect.
 */
export const EFFECTS_STACKING = {
  STACK: 'stack',  // New Effects coexist with old Effects with the same name. 
  NEWEST: 'newest',  // Newest Effect overwrites older Effects with the same name.
  OLDEST: 'oldest',  // Old Effects won't be overwritten by new ones with the same name.
};

export const TIME_ALLOWED_BETWEEN_SUCCESSIVE_COLLISIONS = 1000;

