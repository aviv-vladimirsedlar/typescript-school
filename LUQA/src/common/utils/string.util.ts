export const nameToSlug = (text: string) => {
  return text
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/[^\w-]+/g, '') // Remove all non-word characters (excluding dashes)
    .replace(/--+/g, '-') // Replace multiple dashes with a single dash
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
};
