import { Prop } from '@nestjs/mongoose';
import {
  SuperObject,
  SuperObjectDocument,
  SuperObjectSchema,
} from '../object/super.object.schema';

export class BaseSlide {
  @Prop({
    type: String,
    required: false,
    default: '5.3.0',
  })
  // canvas version
  version: string;
}

export class BaseSlideWithObjects extends BaseSlide {
  @Prop({
    type: [SuperObjectSchema],
    required: false,
    default: [],
  })
  objects: SuperObjectDocument[];
}
