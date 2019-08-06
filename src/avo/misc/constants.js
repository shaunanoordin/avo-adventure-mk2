export const FRAMES_PER_SECOND = 30;
export const SHORT_KEYPRESS_DURATION = 1;

export const MODES = {
  INITIALISING: 'initialising',
  ACTION: 'action',
  CYOA: 'choose your own adventure',  // TODO: change this to 'NOVEL'
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
