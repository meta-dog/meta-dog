import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { App } from '@entities/app';
import { AppService } from './app.service';
import { GetAppResponse } from './responses/get-apps.response';

@Controller('app')
@ApiTags('app')
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  @ApiOkResponse({ type: GetAppResponse })
  async getAllApps(): Promise<App[]> {
    return await this.appService.findAll();
  }
}
