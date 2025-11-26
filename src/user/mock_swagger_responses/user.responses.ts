export class MockUserResponses {
	static login = {
		message: 'User logged in successfully',
		data: {
			jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXI5eEVtTEgiLCJmaXJzdE5hbWUiOm51bGwsImxvZ2luIjp0cnVlLCJpYXQiOjE3NDcxMjMzMzYsImV4cCI6MTc0NzIwOTczNn0.z_yatTmLssqIiMuwt09x5eiF0PzEEeRZeZ5Q5yKv0U4',
			user: {
				id: 5,
				username: 'user9xEmLH',
				email: 'waqar5@yopmail.com',
				password: '$2b$10$d2DFTG0ywTcQIRKLQWjw7uH66PBlYk/sHUYqm/XpD9kGgEajwPb4W',
				firstName: null,
				lastName: null,
				phoneNumber: null,
				status: 'Active',
				address: null,
				profileImage: null,
				registrationType: 'Email',
				cityId: null,
				townId: null,
			},
		},
		status: 200,
	}

	static profile(message: string) {
		return {
			message: message,
			data: {
				profile: {
					id: 5,
					username: 'user9xEmLH',
					email: 'waqar5@yopmail.com',
					firstName: null,
					lastName: null,
					phoneNumber: null,
					gender: null,
					address: null,
					dob: null,
					profileImage: {
						key: '1747128435942profileName',
						url: 'https://asaan-dealing-develop.s3.ap-southeast-1.wasabisys.com/1747128435942profileName?AWSAccessKeyId=IO2HV2W9DHA61ZW57DCS&Expires=1747129816&Signature=3%2F6Qa%2BRFFPyl%2BlhLDBLv%2Bt4%2FE9Y%3D',
					},
					registrationType: 'Email',
					isNotificationEnabled: true,
					cityId: null,
					townId: null,
				},
			},
			status: 200,
		}
	}
}
