export const capitalizeFirstLetter = ([first, ...rest]: string) =>
  first ? first.toUpperCase() + rest.join('') : '';
