import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../enums/user.role';
import { UserAuthProvider } from '../enums/user.auth.provider';
import { Board } from './board.schema';
import { hashSync } from 'bcrypt';
import {
  Schema as MongooseSchema,
  Document as MongooseDocument,
} from 'mongoose';
import { SlideObject } from './slide-object.schema';

export type UserDocument = User & MongooseDocument;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: false,
    nullable: true, // user with external auth provider may not have password
  })
  password: string;

  @Prop({
    required: false,
    enum: UserRole,
    default: UserRole.USER,
  })
  userRole: UserRole;

  @Prop({
    required: false,
    enum: UserAuthProvider,
    default: UserAuthProvider.INTERNAL,
  })
  userAuthProvider: UserAuthProvider;

  @Prop({
    required: false,
    type: Date,
    default: Date.now,
  })
  lastActive: Date;

  // relations

  @Prop({
    required: false,
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Board',
    default: [],
  })
  boards: Board[];

  @Prop({
    required: false,
    type: [MongooseSchema.Types.ObjectId],
    ref: 'SlideObject',
    default: [],
  })
  slideObjects: SlideObject[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.password = hashSync(this.password, 10);
  next();
});
