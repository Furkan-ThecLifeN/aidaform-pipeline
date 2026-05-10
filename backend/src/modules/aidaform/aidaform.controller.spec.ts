import { Test, TestingModule } from '@nestjs/testing';
import { AidaformController } from './aidaform.controller';

describe('AidaformController', () => {
  let controller: AidaformController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AidaformController],
    }).compile();

    controller = module.get<AidaformController>(AidaformController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
