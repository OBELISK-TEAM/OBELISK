import { Prop } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import {
  SuperSlideDocument,
  SuperSlideSchema,
} from '../slide/super.slide.schema';
import { BoardPermissions } from '../../../shared/interfaces/BoardPermissions';

export class BaseBoard {
  @Prop({
    required: false,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  owner: string;
}

export class BaseBoardWithSlides extends BaseBoard {
  @Prop({
    type: [SuperSlideSchema],
    required: false,
    default: [],
  })
  slides: SuperSlideDocument[];
}

export class BaseBoardWithSlidesAndPermissions extends BaseBoardWithSlides {
  @Prop({
    required: false,
    type: {
      viewer: [
        {
          type: MongooseSchema.Types.ObjectId,
          ref: 'User',
        },
      ],
      editor: [
        {
          type: MongooseSchema.Types.ObjectId,
          ref: 'User',
        },
      ],
      moderator: [
        {
          type: MongooseSchema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    default: {
      viewer: [],
      editor: [],
      moderator: [],
    },
    _id: false,
  })
  permissions: BoardPermissions;
}
