import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { App } from '@schemas/app.schema';
import { ReferralInterface } from './app.types';
import { AppService } from './app.service';
import { GetAppResponse } from './responses/get-apps.response';
import { GetReferralResponse } from './responses/get-referral.response';

@Controller('app')
@ApiTags('app')
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  @ApiOkResponse({ type: GetAppResponse })
  async getAllApps(): Promise<App[]> {
    return await this.appService.findAll();
  }

  @Get(':app_id/referral')
  @ApiParam({ name: 'app_id', example: '2376737905701576' })
  @ApiOkResponse({ type: GetReferralResponse })
  async index(@Param('app_id') app_id: string): Promise<ReferralInterface> {
    const { advocate_id } = await this.appService.getReferralForAppByAppId(
      app_id,
    );
    return { advocate_id };
  }

  @Post(':app_id/referral/:advocate_id')
  @ApiParam({ name: 'app_id', example: '2376737905701576' })
  @ApiParam({ name: 'advocate_id', example: '124125' })
  async create(
    @Param('app_id') app_id: string,
    @Param('advocate_id') advocate_id: string,
  ): Promise<void> {
    await this.appService.createReferral(advocate_id, app_id);
  }
}
