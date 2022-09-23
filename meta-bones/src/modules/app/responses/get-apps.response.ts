import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AppInterface } from '../app.types';

@Exclude()
export class GetAppResponse implements AppInterface {
  @ApiProperty({ description: 'The Meta id of the App' })
  @Expose()
  app_id: string;

  @ApiProperty({ description: 'The name of the App' })
  @Expose()
  name: string;
}
