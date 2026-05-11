import { Test, TestingModule } from '@nestjs/testing';
import { PayloadAnalyzerService } from './payload-analyzer.service';

describe('PayloadAnalyzerService', () => {
  let service: PayloadAnalyzerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayloadAnalyzerService],
    }).compile();

    service = module.get<PayloadAnalyzerService>(PayloadAnalyzerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
