import { describe, expect, it } from "vitest";
import { validateAuthForm, validateNewPassword } from "@/lib/auth-validation";

describe("auth validation", () => {
  it("rejects an invalid email", () => {
    expect(validateAuthForm("signin", "nope", "x").email).toBeDefined();
  });
  it("requires at least 8 characters on sign-up", () => {
    expect(validateAuthForm("signup", "a@b.co", "1234567").password).toBeDefined();
    expect(validateAuthForm("signup", "a@b.co", "12345678").password).toBeUndefined();
  });
  it("forgot mode needs no password", () => {
    expect(validateAuthForm("forgot", "a@b.co", "")).toEqual({});
  });
  it("new password must match confirmation", () => {
    expect(validateNewPassword("12345678", "12345679")).toBe("Passwords don't match.");
    expect(validateNewPassword("12345678", "12345678")).toBeNull();
  });
});
