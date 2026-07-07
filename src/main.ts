import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ReponseFormaterInterceptor } from './interceptors/reponse-formater.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { GlobalException } from './filters/global.filter';
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from 'path';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalInterceptors(new ReponseFormaterInterceptor, new LoggingInterceptor);
  app.useGlobalFilters(new GlobalException);
  app.useStaticAssets(join(__dirname, "..", "uploads"), { prefix: "/uploads/" });


  const config = new DocumentBuilder()
  .setTitle("Dental Hub")
  .setDescription("This is a full api for dental hub")
  .setVersion("1.0.0")
  .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT", name: "Authorization", in: "header" })
  .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document, { swaggerOptions: { persistAuthorization: true } });

  await app.listen(process.env.HOST_PORT!);


}
bootstrap();
