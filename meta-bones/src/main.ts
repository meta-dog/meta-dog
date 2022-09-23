import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BaseAppModule } from './baseapp.module';

async function bootstrap() {
  const app = await NestFactory.create(BaseAppModule);

  const config = new DocumentBuilder()
    .setTitle('Meta-Dog (actually a 😾)')
    .setDescription(
      'This API helps connect Friends and Advocates so everybody can enjoy more Meta Apps',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(5000);
}
bootstrap();
