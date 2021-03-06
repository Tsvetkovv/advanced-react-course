import { createTransport, getTestMessageUrl } from 'nodemailer';

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeANiceEmail(text: string): string {
  return `
    <div style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
    "
    >
    <h2>Hello There!</h2>
    <p>${text}</p>
    </div>
  `;
}

export interface Envelope {
  from: string;
  to: string[];
}

interface MailResponse {
  accepted: string[];
  rejected: string[];
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: Envelope;
  messageId: string;
}

export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  const info: MailResponse = await transport.sendMail({
    to,
    from: 'test@example.com',
    subject: 'Your password reset token!',
    html: makeANiceEmail(`Your Password Reset Token is here!
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click here to reset</a>
    `),
  });

  if (process.env.MAIL_USER.includes('ethereal.email')) {
    console.log(
      `💌 Message sent! Preview it at ${getTestMessageUrl(info).toString()}`
    );
  }
}
