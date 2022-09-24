import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Advocate, AdvocateSchema } from '@schemas/advocate.schema';
import { App, AppSchema } from '@schemas/app.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: App.name, schema: AppSchema },
      { name: Advocate.name, schema: AdvocateSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
