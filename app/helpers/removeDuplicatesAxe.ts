function removeDuplicatesAxe<T extends { nom_axe: string }>(array: T[]): T[] {
  const seen = new Set();
  return array.filter(item => {
    const duplicate = seen.has(item.nom_axe);
    seen.add(item.nom_axe);
    return !duplicate;
  });
}

export default removeDuplicatesAxe;
