import { Controller, Get } from '@nestjs/common';
import { HealthService } from '../health.service';
import { StatusInterface } from '../interfaces/status.interface';

@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  getStatus(): StatusInterface {
    const health = this.healthService.getStatus();
    return health.getResource();
  }
}
