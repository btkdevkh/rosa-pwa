// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataASC = <T extends Record<string, any>>(
  data: T[],
  property: keyof T
) => {
  return data.sort((a, b) => {
    const aValue = a[property];
    const bValue = b[property];

    if (typeof aValue !== "string" || typeof bValue !== "string") {
      throw new Error(
        `Property "${String(property)}" must be of type string for sorting.`
      );
    }

    return aValue.localeCompare(bValue);
  });
};

export default dataASC;
