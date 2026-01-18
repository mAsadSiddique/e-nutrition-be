import sgMail from '@sendgrid/mail'
import { ENV } from 'src/config/constant'

export class Mailer {
	static async sendForgotPasswordCode(email: string, name: string, code: string): Promise<boolean> {
		sgMail.setApiKey(ENV.EMAIL_CONFIG.SEND_GRID_API_KEY || '')
		const msg = {
			to: email,
			from: ENV.EMAIL_CONFIG.SUPPORT_SENDER_EMAIL,
			templateId: 'd-bcd5f839d1b54cff96ecd9353d6ae672',
			dynamic_template_data: {
				name: name?.trim?.length ? name : 'user',
				code,
				supportEmail: ENV.EMAIL_CONFIG.SUPPORT_SENDER_EMAIL || 'support@nutritionist.com',
				securityEmail: ENV.EMAIL_CONFIG.SECURITY_EMAIL || 'security@nutritionist.com'
			},
		}
		try {
			await sgMail.send(msg as any)
			return true
		} catch (error) {
			console.log(JSON.stringify(error))
			return false
		}
	}

	static async sendEmailVerificationCode(email: string, name: string, code: string): Promise<boolean> {
		sgMail.setApiKey(ENV.EMAIL_CONFIG.SEND_GRID_API_KEY || '')
		const msg = {
			to: email,
			from: ENV.EMAIL_CONFIG.SUPPORT_SENDER_EMAIL,
			templateId: 'd-4d182524bb7243d6907186a9e05e7bf6',
			dynamic_template_data: {
				name: name?.trim?.length ? name : 'user',
				code,
				supportEmail: ENV.EMAIL_CONFIG.SUPPORT_SENDER_EMAIL || 'support@nutritionist.com',
				securityEmail: ENV.EMAIL_CONFIG.SECURITY_EMAIL || 'security@nutritionist.com'
			},
		}
		try {
			await sgMail.send(msg)
			return true
		} catch (error) {
			console.log(JSON.stringify(error))
			return false
		}
	}

	static async sendAdminCredentials(email: string, name: string, password: string): Promise<boolean> {
		sgMail.setApiKey(ENV.EMAIL_CONFIG.SEND_GRID_API_KEY || '')
		const msg = {
			to: email,
			from: ENV.EMAIL_CONFIG.SUPPORT_SENDER_EMAIL,
			templateId: 'd-6bb49b313cbd444882bd405c5b2e5e86',
			dynamic_template_data: {
				name: name?.trim?.length ? name : 'Admin',
				email,
				password,
				supportEmail: ENV.EMAIL_CONFIG.SUPPORT_SENDER_EMAIL || 'support@nutritionist.com',
				securityEmail: ENV.EMAIL_CONFIG.SECURITY_EMAIL || 'security@nutritionist.com',
			},
		}

		try {
			await sgMail.send(msg as any)
			return true
		} catch (error) {
			console.error(`${this.sendAdminCredentials.name} throwing error during sending email:`, JSON.stringify(error))
			return false
		}
	}
}
