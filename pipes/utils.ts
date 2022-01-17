export const find = <T>(arr: T[], condition: (t: T) => boolean) => {
  for (const item of arr) {
    if (condition(item)) {
      return item;
    }
  }

  return null;
};
