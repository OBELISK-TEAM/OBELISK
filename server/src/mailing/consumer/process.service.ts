import { Injectable } from '@nestjs/common';

@Injectable()
export class ProcessService {
  async process(data: any) {
    console.log('Processing data', data);
    return new Promise<any>(() => {
      setTimeout(() => {
        console.log('Data processed');
      }, 10000);
    });
  }
}
