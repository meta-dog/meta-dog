import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from '@entities/app';
import { Advocate } from '@entities/advocate';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TypeOrmModule.forFeature([App, Advocate])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
