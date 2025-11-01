import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'
import { Transform } from 'class-transformer'

export class VerifyCodeDTO {
    @ApiProperty({
        description: "Admin's email",
        nullable: false,
        example: 'admin@example.com',
    })
    @IsNotEmpty()
    @IsEmail()
    @Transform((email) => email.value.toLowerCase())
    email: string

    @ApiProperty({
        description: 'Verification code sent to email',
        nullable: false,
        example: '123456',
    })
    @IsNotEmpty()
    @IsString()
    @Length(6, 6)
    code: string
}