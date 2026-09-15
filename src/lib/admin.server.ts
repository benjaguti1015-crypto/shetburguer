/** Clave del panel de administración. Cambiala acá o con la variable ADMIN_PASSWORD. */
const DEFAULT_ADMIN_PASSWORD = "shet2026";

export function checkAdminPassword(password: string): boolean {
  const expected = process.env["ADMIN_PASSWORD"] || DEFAULT_ADMIN_PASSWORD;
  return typeof password === "string" && password.trim() === expected;
}
