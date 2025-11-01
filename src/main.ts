import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ENV } from './config/constant';

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
	app.enableCors()
	const config = new DocumentBuilder()
		.setTitle('E-Nutrition APIs')
		.setDescription('put short description for your apis collection')
		.setVersion('1.0')
		.addTag('put Tag')
		.addBearerAuth({ type: 'apiKey', name: 'Authorization', in: 'header', bearerFormat: 'JWT' }, 'JWT')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document)
	await app.listen(ENV.PORT || 3000)
}
bootstrap();
