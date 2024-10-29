export const sanitizeEmail = (value: string) => {
  return value.trim().replace(/\s+/g, '');
};

export const sanitizeString = (value: string) => {
  return value.trim().replace(/\s+/g, ' ');
};
