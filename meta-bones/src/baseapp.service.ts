import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseAppService {
  getApps(): string {
    return 'Hello World!';
  }
}
