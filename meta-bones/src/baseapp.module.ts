import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config';
import { DatabaseConnectionService } from './database-connection-service';
import { AppModule } from './modules/app/app.module';
import { ReferralModule } from './modules/referral/referral.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConnectionService,
    }),
    AppModule,
    ReferralModule,
  ],
  controllers: [],
  providers: [],
})
export class BaseAppModule {}
