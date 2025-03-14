const generateYAxisTicks = (
  min: number,
  max: number,
  tickCount: number = 5
): number[] => {
  const step = (max - min) / (tickCount - 1);
  return Array.from({ length: tickCount }, (_, i) =>
    Math.round(min + i * step)
  ).filter(f => f != null);
};

export default generateYAxisTicks;
