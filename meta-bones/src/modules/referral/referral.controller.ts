import { Controller, Get, Param, Post } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetReferralResponse } from './responses/get-referral.response';
import { ReferralInterface } from './referral.types';

@Controller('app')
@ApiTags('app')
export class ReferralController {
  constructor(private referralService: ReferralService) {}

  @Get(':app_id/referral')
  @ApiParam({ name: 'app_id', example: '2376737905701576' })
  @ApiOkResponse({ type: GetReferralResponse })
  async index(@Param('app_id') app_id: string): Promise<ReferralInterface> {
    const { advocate_id } = await this.referralService.findByAppId(app_id);
    return { advocate_id };
  }

  @Post(':app_id/referral/:advocate_id')
  @ApiParam({ name: 'app_id', example: '2376737905701576' })
  @ApiParam({ name: 'advocate_id', example: '124125' })
  async create(
    @Param('app_id') app_id: string,
    @Param('advocate_id') advocate_id: string,
  ): Promise<void> {
    await this.referralService.create(advocate_id, app_id);
  }
}
