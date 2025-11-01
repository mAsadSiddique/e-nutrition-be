import {ApiResponse} from '@nestjs/swagger'
import { RESPONSE_MESSAGES } from '../enums/response-messages.enum'

export class MockErrorResponses {
	static sendInternalServerErrorResponse() {
		return ApiResponse({
			status: 500,
			description: 'Internal Server Error',
			content: {
				'application/json': {
					example: {
						statusCode: 500,
						message: RESPONSE_MESSAGES.SERVER_TEMPORY_DOWN,
						error: 'Internal Server Error',
					},
				},
			},
		})
	}

	static sendNotFoundResponse(message: string) {
		return ApiResponse({
			status: 404,
			description: 'Not Found',
			content: {
				'application/json': {
					example: {
						statusCode: 404,
						message: message,
						error: 'Not Found',
					},
				},
			},
		})
	}

	static sendConflictResponse(message: string) {
		return ApiResponse({
			status: 409,
			description: 'Conflict',
			content: {
				'application/json': {
					example: {
						statusCode: 409,
						message: message,
						error: 'Conflict',
					},
				},
			},
		})
	}

	static sendBbadRequestResponse() {
		return ApiResponse({
			status: 400,
			description: 'Bad Request',
			content: {
				'application/json': {
					example: {
						statusCode: 400,
						message: 'Invalid input data',
						error: 'Bad Request',
					},
				},
			},
		})
	}

	static sendForbiddenResponse() {
		return ApiResponse({
			status: 403,
			description: 'Forbidden',
			content: {
				'application/json': {
					example: {
						statusCode: 403,
						message: 'Forbidden resource',
						error: 'Forbidden',
					},
				},
			},
		})
	}

	static sendUnprocessableResponse(message: string) {
		return ApiResponse({
			status: 422,
			description: 'Unprocessable Entity',
			content: {
				'application/json': {
					example: {
						statusCode: 422,
						message: message,
						error: 'Unprocessable Entity',
					},
				},
			},
		})
	}

	static sendNotAcceptableResponse(message: string) {
		return ApiResponse({
			status: 406,
			description: 'Not Acceptable',
			content: {
				'application/json': {
					example: {
						statusCode: 406,
						message: message,
						error: 'Not Acceptable',
					},
				},
			},
		})
	}

	static sendUnauthorizedResponse() {
		return ApiResponse({
			status: 401,
			description: 'Unauthorized',
			content: {
				'application/json': {
					example: {
						statusCode: 401,
						message: RESPONSE_MESSAGES.UNAUTHORIZED,
						error: 'Unauthorized',
					},
				},
			},
		})
	}
}
