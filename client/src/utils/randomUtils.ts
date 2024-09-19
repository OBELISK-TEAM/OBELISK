export const generateId = (prefix: string = "") =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
