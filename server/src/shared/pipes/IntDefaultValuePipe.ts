import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class IntDefaultValuePipe implements PipeTransform {
  constructor(private readonly defaultValue: number) {}

  transform(value: string): number {
    const val = parseInt(value, 10);
    return isNaN(val) ? this.defaultValue : val;
  }
}
