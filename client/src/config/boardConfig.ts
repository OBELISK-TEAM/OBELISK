export const BOARD_LIMITS = {
  SLIDE_LIMIT_PER_BOARD: parseInt(process.env.SLIDE_LIMIT_PER_BOARD || "15", 10),
  MAX_BOARD_SIZE_IN_BYTES: parseInt(process.env.MAX_BOARD_SIZE_IN_BYTES || "15728640", 10),
};
