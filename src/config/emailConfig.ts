export const emailConfig = {
  IS_EMAIL_USE_SMTP: process.env.IS_EMAIL_USE_SMTP || "off",
  EMAIL_HOST: process.env.EMAIL_HOST || "",
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || "465"),
  FROM_EMAIL: process.env.FROM_EMAIL || "",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
};
