import { Resend } from 'resend'
import { ENV } from 'src/config/constant'

export class Mailer {
	private static getResendClient(): Resend {
		return new Resend(ENV.EMAIL_CONFIG.RESEND_API_KEY)
	}

	private static getSupportEmail(): string {
		return ENV.EMAIL_CONFIG.SUPPORT_SENDER_EMAIL || 'support@nutritionist.com'
	}

	private static getSecurityEmail(): string {
		return ENV.EMAIL_CONFIG.SECURITY_EMAIL || 'security@nutritionist.com'
	}

	private static displayName(name: string, fallback: string): string {
		return name?.trim?.length ? name.trim() : fallback
	}

	private static buildEmailLayout(options: {
		title: string
		greeting: string
		bodyHtml: string
		supportEmail: string
		securityEmail: string
	}): string {
		const { title, greeting, bodyHtml, supportEmail, securityEmail } = options
		return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f6f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.08);">
          <tr>
            <td style="padding:28px 32px;background:linear-gradient(135deg,#0f766e,#14b8a6);color:#ffffff;">
              <h1 style="margin:0;font-size:24px;line-height:1.3;">${title}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">${greeting}</p>
              ${bodyHtml}
              <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#6b7280;">
                If you did not request this email, please contact us at
                <a href="mailto:${securityEmail}" style="color:#0f766e;">${securityEmail}</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:13px;line-height:1.5;color:#6b7280;">
                Need help? Email
                <a href="mailto:${supportEmail}" style="color:#0f766e;text-decoration:none;">${supportEmail}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
	}

	static async sendForgotPasswordCode(email: string, name: string, code: string): Promise<boolean> {
		const supportEmail = this.getSupportEmail()
		const securityEmail = this.getSecurityEmail()
		const displayName = this.displayName(name, 'user')

		try {
			const { error } = await this.getResendClient().emails.send({
				from: supportEmail,
				to: email,
				subject: 'Reset Your Password',
				html: this.buildEmailLayout({
					title: 'Reset Your Password',
					greeting: `Hi ${displayName},`,
					bodyHtml: `
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">
                We received a request to reset your password. Use the verification code below to continue.
              </p>
              <div style="margin:24px 0;padding:20px;background:#f0fdfa;border:1px solid #99f6e4;border-radius:10px;text-align:center;">
                <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#0f766e;">Your reset code</p>
                <p style="margin:0;font-size:32px;font-weight:700;letter-spacing:0.3em;color:#134e4a;">${code}</p>
              </div>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#6b7280;">
                This code expires in 5 minutes. For your security, do not share it with anyone.
              </p>`,
					supportEmail,
					securityEmail,
				}),
			})

			if (error) {
				console.log(JSON.stringify(error))
				return false
			}
			return true
		} catch (error) {
			console.log(JSON.stringify(error))
			return false
		}
	}

	static async sendEmailVerificationCode(email: string, name: string, code: string): Promise<boolean> {
		const supportEmail = this.getSupportEmail()
		const securityEmail = this.getSecurityEmail()
		const displayName = this.displayName(name, 'user')

		try {
			const { error } = await this.getResendClient().emails.send({
				from: supportEmail,
				to: email,
				subject: 'Verify Your Email',
				html: this.buildEmailLayout({
					title: 'Verify Your Email',
					greeting: `Hi ${displayName},`,
					bodyHtml: `
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">
                Thanks for signing up. Please verify your email address using the code below.
              </p>
              <div style="margin:24px 0;padding:20px;background:#f0fdfa;border:1px solid #99f6e4;border-radius:10px;text-align:center;">
                <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#0f766e;">Your verification code</p>
                <p style="margin:0;font-size:32px;font-weight:700;letter-spacing:0.3em;color:#134e4a;">${code}</p>
              </div>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#6b7280;">
                This code expires in 5 minutes. Enter it in the app to complete your registration.
              </p>`,
					supportEmail,
					securityEmail,
				}),
			})

			if (error) {
				console.log(JSON.stringify(error))
				return false
			}
			return true
		} catch (error) {
			console.log(JSON.stringify(error))
			return false
		}
	}

	static async sendAdminCredentials(email: string, name: string, password: string): Promise<boolean> {
		const supportEmail = this.getSupportEmail()
		const securityEmail = this.getSecurityEmail()
		const displayName = this.displayName(name, 'Admin')

		try {
			const { error } = await this.getResendClient().emails.send({
				from: supportEmail,
				to: email,
				subject: 'Your Admin Credentials',
				html: this.buildEmailLayout({
					title: 'Your Admin Credentials',
					greeting: `Hi ${displayName},`,
					bodyHtml: `
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">
                Your admin account has been created. Use the credentials below to sign in.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="padding:14px 16px;background:#f9fafb;font-size:14px;color:#6b7280;width:120px;">Email</td>
                  <td style="padding:14px 16px;font-size:14px;color:#111827;">${email}</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;background:#f9fafb;font-size:14px;color:#6b7280;">Password</td>
                  <td style="padding:14px 16px;font-size:14px;color:#111827;font-weight:700;">${password}</td>
                </tr>
              </table>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#6b7280;">
                Please change your password after your first login.
              </p>`,
					supportEmail,
					securityEmail,
				}),
			})

			if (error) {
				console.error(`${this.sendAdminCredentials.name} throwing error during sending email:`, JSON.stringify(error))
				return false
			}
			return true
		} catch (error) {
			console.error(`${this.sendAdminCredentials.name} throwing error during sending email:`, JSON.stringify(error))
			return false
		}
	}
}
