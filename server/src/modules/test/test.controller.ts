import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  async getHello(): Promise<string> {
    await this.testService.sendMessage();
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('waiting');
        resolve('Hello World!');
      }, 10000);
    });
  }
}
