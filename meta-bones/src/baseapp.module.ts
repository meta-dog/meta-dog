import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './config';
import { AppModule } from './modules/app/app.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('database.uri'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: config.get('database.dbName'),
      }),
    }),
    AppModule,
  ],
  controllers: [],
  providers: [],
})
export class BaseAppModule {}
