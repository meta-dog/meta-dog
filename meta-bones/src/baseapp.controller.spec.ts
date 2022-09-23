import { Test, TestingModule } from '@nestjs/testing';
import { BaseAppController } from './baseapp.controller';
import { BaseAppService } from './baseapp.service';

describe('AppController', () => {
  let appController: BaseAppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BaseAppController],
      providers: [BaseAppService],
    }).compile();

    appController = app.get<BaseAppController>(BaseAppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getApps()).toBe('Hello World!');
    });
  });
});
