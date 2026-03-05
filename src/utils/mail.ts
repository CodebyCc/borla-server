import fs from "fs";
import path from "path";

import { MailtrapClient } from "mailtrap";
import nodemailer from "nodemailer";

import {
  AUTH_EMAIL,
  MAILTRAP_PASS,
  MAILTRAP_TOKEN,
  MAILTRAP_USER,
  SIGN_IN_URL,
  VERIFICATION_EMAIL,
} from "#/utils/variables";
import { generateToken } from "#/utils/helper";
import { generateTemplate } from "#/mail/template";

import MobileUser from "#/models/MobileUser";
import EmailVerificationToken from "#/models/emailVerificationToken";

const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });

  return transport;
};

interface Profile {
  name: string;
  email: string;
  userId: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
  // const transport = generateMailTransporter();

  const { name, email, userId } = profile;

  const welcomeMessage = `Hi ${name}, Welcome to Boorlaman! There is so much we do for verified users. Use the given OTP to verify your email and become a part of our lovely family.`;

  // const TOKEN = "fcff67ea58e87e0790bdf325c52a4539";
  // b9b8603b5e8e782fda31b03c81e86eb6

  const client = new MailtrapClient({
    token: MAILTRAP_TOKEN,
  });

  const sender = {
    email: VERIFICATION_EMAIL,
    name: "Boorlaman",
  };
  const recipients = [
    {
      email: email,
    },
  ];
  const welcomeImage = fs.readFileSync(
    path.join(__dirname, "../mail/images/welcome.png"),
  );
  const logoImage = fs.readFileSync(
    path.join(__dirname, "../mail/images/logo.png"),
  );

  client.send({
    from: sender,
    to: recipients,

    template_uuid: "621afcef-9ed1-42c4-bd3f-93ce82d327fe",
    template_variables: {
      name,
      token,
    },
  });
  // client.send({
  //   from: sender,
  //   to: recipients,
  //   template_uuid: "621afcef-9ed1-42c4-bd3f-93ce82d327fe",
  //   subject: "Verification Email!",
  //   html: generateTemplate({
  //     title: "Obaak3 Boorlaman!!",
  //     message: welcomeMessage,
  //     logo: "cid:logo",
  //     banner: "cid:welcome",
  //     link: "#",
  //     btnTitle: token,
  //   }),
  //   category: "Verification Mail",
  //   attachments: [
  //     {
  //       filename: "welcome.png",
  //       content_id: "welcome",
  //       disposition: "inline",
  //       content: welcomeImage,
  //       type: "image/png",
  //     },
  //     {
  //       filename: "logo.png",
  //       content_id: "logo",
  //       disposition: "inline",
  //       content: logoImage,
  //       type: "image/png",
  //     },
  //   ],
  // });
};

interface Options {
  email: string;
  link: string;
}
export const sendForgetPasswordLink = async (options: Options) => {
  const { email, link } = options;

  // const message =
  //   "We just received a request that you forgot your password. No problem you can use the link below and create brand new password.";

  const client = new MailtrapClient({
    token: MAILTRAP_TOKEN,
  });

  const sender = {
    email: AUTH_EMAIL,
    name: "Boorlaman Password Reset",
  };
  const recipients = [
    {
      email: email,
    },
  ];

  client.send({
    from: sender,
    to: recipients,
    template_uuid: "a73b9e48-ed7e-4afd-abd8-fb3d62285b7f",
    template_variables: {
      user_email: email,
      pass_reset_link: link,
    },
  });

  // transport.sendMail({
  //   to: email,
  //   from: VERIFICATION_EMAIL,
  //   subject: "Reset Password Link",
  //   html: generateTemplate({
  //     title: "Forget Password",
  //     message,
  //     logo: "cid:logo",
  //     banner: "cid:forget_password",
  //     link,
  //     btnTitle: "Reset Password",
  //   }),
  //   attachments: [
  //     {
  //       filename: "logo.png",
  //       path: path.join(__dirname, "../mail/logo.png"),
  //       cid: "logo",
  //     },
  //     {
  //       filename: "forget_password.png",
  //       path: path.join(__dirname, "../mail/forget_password.png"),
  //       cid: "forget_password",
  //     },
  //   ],
  // });
};

export const sendPasswordResetSuccessEmail = async (
  name: string,
  email: string,
) => {
  const client = new MailtrapClient({
    token: MAILTRAP_TOKEN,
  });

  const sender = {
    email: AUTH_EMAIL,
    name: "Boorlaman Password Reset",
  };
  // const recipients = [
  //   {
  //     email: email,
  //   },
  // ];

  // const message = `Dear ${name} we just updated your new password . You can now sign in with your new password`;

  client.send({
    from: sender,
    to: [
      {
        email: email,
      },
    ],
    template_uuid: "2034f955-a34a-4074-9664-2426d5ca22d7",
    template_variables: {
      name: name,
      email: email,
      company_info_name: "Boorlaman",
    },
  });

  // transport.sendMail({
  //   to: email,
  //   from: VERIFICATION_EMAIL,
  //   subject: " Password Reset Successfully",
  //   html: generateTemplate({
  //     title: "Password Reset Successfully",
  //     message,
  //     logo: "cid:logo",
  //     banner: "cid:forget_password",
  //     link: SIGN_IN_URL,
  //     btnTitle: "Reset Password",
  //   }),
  //   attachments: [
  //     {
  //       filename: "logo.png",
  //       path: path.join(__dirname, "../mail/logo.png"),
  //       cid: "logo",
  //     },
  //     {
  //       filename: "forget_password.png",
  //       path: path.join(__dirname, "../mail/forget_password.png"),
  //       cid: "forget_password",
  //     },
  //   ],
  // });
};
