import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BaseAppModule } from './baseapp.module';

declare const module: any;

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

  const configService: ConfigService = app.get(ConfigService);
  const appPort = configService.get('app.port') || 3500;
  Logger.log('Listening to port ' + appPort);
  await app.listen(appPort);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
