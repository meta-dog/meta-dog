import { Controller, Get } from '@nestjs/common';
import { BaseAppService } from './baseapp.service';

@Controller()
export class BaseAppController {
  constructor(private readonly appService: BaseAppService) {}

  @Get('apps')
  getApps(): string {
    return this.appService.getApps();
  }
}
