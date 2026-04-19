import { nanoid } from "nanoid";

/**
 * Generate a unique signup code for clients
 * Format: XXXX-XXXX (8 characters, uppercase alphanumeric)
 */
export const generateSignupCode = () => {
  const code = nanoid(8).toUpperCase();
  return `${code.slice(0, 4)}-${code.slice(4, 8)}`;
};
