import {ApiResponse} from '@nestjs/swagger'
import { ObjectType } from '../types/generic_types.type'

export class MockOkResponses {
	static sendOkResponse(mockResponse: ObjectType) {
		return ApiResponse({
			status: 200,
			description: 'Successful',
			content: {
				'application/json': {
					example: mockResponse,
				},
			},
		})
	}

	static sendEmptyResponse(message: string) {
		return ApiResponse({
			content: {
				'application/json': {
					example: {
						message,
						data: null,
						status: 200,
					},
				},
			},
		})
	}
}
