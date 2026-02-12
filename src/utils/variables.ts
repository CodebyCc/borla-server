// export const MONGO_URI = process.env.MONGO_URI as string;

const { env } = process as { env: { [key: string]: string } };

export const {
  MONGO_URI,
  MAILTRAP_USER,
  MAILTRAP_PASS,
  MAILTRAP_TOKEN,
  VERIFICATION_EMAIL,
  PASSWORD_RESET_LINK,
  SIGN_IN_URL,
  JWT_SECRET,
} = env;
