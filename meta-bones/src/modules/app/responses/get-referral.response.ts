import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ReferralInterface } from '../app.types';

@Exclude()
export class GetReferralResponse implements ReferralInterface {
  @ApiProperty({ description: 'The username of the Advocate' })
  @Expose()
  advocate_id: string;
}
