export type AuthMode = "signin" | "signup" | "forgot";

export const MIN_PASSWORD = 8;

export function validateAuthForm(mode: AuthMode, email: string, password: string) {
  const errors: { email?: string; password?: string } = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Enter a valid email address.";
  if (mode === "signin" && !password) errors.password = "Enter your password.";
  if (mode === "signup" && password.length < MIN_PASSWORD) errors.password = `Use at least ${MIN_PASSWORD} characters.`;
  return errors;
}

export function validateNewPassword(password: string, confirm: string) {
  if (password.length < MIN_PASSWORD) return `Use at least ${MIN_PASSWORD} characters.`;
  if (password !== confirm) return "Passwords don't match.";
  return null;
}
