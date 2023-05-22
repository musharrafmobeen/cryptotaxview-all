import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'client'));

  app.use(morgan('tiny'));
  //console.log("");
  const config = new DocumentBuilder()
    .setTitle('Cryptotaxview')
    .setDescription('The Cryptotaxview API description')
    .setVersion('1.0')
    .addTag('Cryptotaxview')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(process.env.PORT ? process.env.PORT : 5001);
}
bootstrap();
