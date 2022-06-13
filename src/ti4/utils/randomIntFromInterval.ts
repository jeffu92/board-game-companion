export const randomIntFromInterval: (min: number, max: number) => number = (
  min,
  max
) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
