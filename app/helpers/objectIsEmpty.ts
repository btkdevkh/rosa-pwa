// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const objectIsEmpty = <T extends Record<string, any> | null | undefined>(
  obj: T
): boolean => {
  return obj == null || Object.values(obj).length === 0;
};
