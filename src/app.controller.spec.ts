import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
<<<<<<< HEAD
import { AppService } from './app.service';
=======
>>>>>>> docs/specs

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
<<<<<<< HEAD
      providers: [AppService],
=======
>>>>>>> docs/specs
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
<<<<<<< HEAD
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
=======
    it('should be defined', () => {
      expect(appController).toBeDefined();
>>>>>>> docs/specs
    });
  });
});
