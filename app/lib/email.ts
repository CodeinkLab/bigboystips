import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT!),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendVerificationEmail = async (email: string, verificationUrl: string) => {
  const mailOptions = {
    from: `BigBoysTips <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Verify your email address',
    html: `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Welcome to BigBoysTips!</h1>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          Thank you for signing up. Please click the button below to verify your email address:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #df5b0f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Verify Email
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, you can also click this link:
          <a href="${verificationUrl}">${verificationUrl}</a>
        </p>
        <p style="color: #666; font-size: 14px;">
          This verification link will expire in 24 hours.
        </p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)

  console.log(
    process.env.SMTP_USER,
    process.env.SMTP_PASS,
    process.env.SMTP_HOST,
    parseInt(process.env.SMTP_PORT!)
  )
}
