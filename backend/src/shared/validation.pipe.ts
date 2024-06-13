// import {
//   Injectable,
//   PipeTransform,
//   ArgumentMetadata,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { plainToClass } from 'class-transformer';
// import { validate, ValidationError } from 'class-validator';
//
// @Injectable()
// export class ValidationPipe implements PipeTransform {
//   async transform(
//     value: unknown,
//     { metatype }: ArgumentMetadata,
//   ): Promise<unknown> {
//     if (
//       value instanceof Object &&
//       this.isEmpty(value as Record<string, unknown>)
//     ) {
//       throw new HttpException(
//         'Validation failed: No body submitted',
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//
//     if (!metatype || !this.toValidate(metatype)) {
//       return value;
//     }
//
//     const object = plainToClass(metatype, value);
//     const errors = await validate(object);
//     if (errors.length > 0) {
//       throw new HttpException(
//         `Validation failed: ${this.formatErrors(errors)}`,
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//     return value;
//   }
//
//   private isEmpty(value: Record<string, unknown>): boolean {
//     return Object.keys(value).length === 0;
//   }
//
//   private toValidate(metatype: new (...args: unknown[]) => object): boolean {
//     const types: Array<new (...args: unknown[]) => object> = [
//       String,
//       Boolean,
//       Number,
//       Array,
//       Object,
//     ];
//     return !types.includes(metatype);
//   }
//
//   private formatErrors(errors: ValidationError[]): string {
//     return errors
//       .map((err: ValidationError) =>
//         Object.values(err.constraints || {}).join(', '),
//       )
//       .join(', ');
//   }
// }
