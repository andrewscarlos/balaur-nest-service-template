import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthController } from '../controllers/health.controller';
import { HealthService } from '../health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStatus', () => {
    it('should return the correct application status object', () => {
      const expectedResponse = {
        alive: true,
        applicationName: configService.get<string>('APPLICATION_NAME'),
        grpcPort: 'unknown port',
        restPort: 'unknown port',
        env: process.env?.APPLICATION_ENV || 'unknown environment',
        message: 'Parfin we love you',
      };

      expect(controller.getStatus()).toStrictEqual(expectedResponse);
    });
  });
});
