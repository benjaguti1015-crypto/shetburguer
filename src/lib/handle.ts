/** Normaliza un usuario de Instagram: sin @, en minúsculas y sin espacios. */
export function normalizeHandle(value: string): string {
  return value
    .trim()
    .replace(/^@+/, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}
