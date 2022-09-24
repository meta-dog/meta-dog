import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class DatabaseConnectionService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}
  createMongooseOptions(): MongooseModuleOptions {
    return (this.configService as any).get('database');
  }
}
