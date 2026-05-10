import { Test, TestingModule } from '@nestjs/testing';
import { AidaformService } from './aidaform.service';

describe('AidaformService', () => {
  let service: AidaformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AidaformService],
    }).compile();

    service = module.get<AidaformService>(AidaformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
