import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApps(): string {
    return 'Hello World!';
  }
}
