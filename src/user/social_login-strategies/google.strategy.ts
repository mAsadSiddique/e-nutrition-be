import {PassportStrategy, AuthGuard} from '@nestjs/passport'
import {Strategy, VerifyCallback} from 'passport-google-oauth20'
import {ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common'
import {SharedService} from '../../shared/shared.service'
import {ENV} from 'src/config/constant'
import {UserSocialLoginType} from 'src/utils/types/user_social_login.type'
import {Request} from 'express'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(private readonly sharedService: SharedService) {
		super({
			clientID: ENV.GOOGLE_LOGIN.CLIENT_ID,
			clientSecret: ENV.GOOGLE_LOGIN.SECRET,
			callbackURL: ENV.GOOGLE_LOGIN.REDIRECT_URL,
			scope: ['email', 'profile'],
		})
	}

	async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
		try {
			console.log(`Google profile: ${JSON.stringify(profile)}`)
			const {id, name, emails, photos, phoneNumbers} = profile
			const user: UserSocialLoginType = {
				password: id,
				email: emails[0].value,
				firstName: name.givenName,
				lastName: name.familyName,
				username: (name.givenName + id)?.toLowerCase()?.replace(/\s+/g, ''),
				phoneNumber: phoneNumbers && phoneNumbers.length > 0 ? phoneNumbers[0].value : undefined,
				profileImage: {key: id, url: photos[0].value},
			}
			done(null, user)
		} catch (error) {
			this.sharedService.sendError(error, this.validate.name)
		}
	}
}

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		return super.canActivate(context) as Promise<boolean>
	}

	// Allow graceful handling when user cancels consent (error=access_denied)
	override handleRequest<TUser extends UserSocialLoginType | null = UserSocialLoginType | null>(
		err: Error | null,
		user: TUser | false,
		info: {message?: string} | undefined,
		context: ExecutionContext,
		status?: number
	): TUser {
		const req = context.switchToHttp().getRequest<Request>()
		if (req?.query?.error === 'access_denied') {
			// Do not throw; let controller handle redirect for cancel case
			return null as TUser
		}
		if (err || !user) {
			// Fall back to default behavior (throw unauthorized)
			if (err) throw err
			throw new UnauthorizedException(info?.message || 'Unauthorized')
		}
		return user
	}
}
