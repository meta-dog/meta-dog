import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from '@entities/app';
import { Advocate } from '@entities/advocate';
import { ReferralController } from './referral.controller';
import { ReferralService } from './referral.service';

@Module({
  imports: [TypeOrmModule.forFeature([App, Advocate])],
  controllers: [ReferralController],
  providers: [ReferralService],
})
export class ReferralModule {}
