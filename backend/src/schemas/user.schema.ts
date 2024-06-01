import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRoleEnum } from '../enums/user.role.enum';
import { UserTypeEnum } from '../enums/user.type.enum';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

// @Prop([String])
// permissions: string[];

// no need prop for id, it is automatically created by mongoose

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({
    required: true,
    nullable: true, // google user
  })
  password: string;

  @Prop({
    required: false,
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  userRole: UserRoleEnum;

  @Prop({
    required: false,
    enum: UserTypeEnum,
    default: UserTypeEnum.NORMAL,
  })
  userType: UserTypeEnum;

  @Prop({
    required: false,
    type: Date,
    default: Date.now,
  })
  created: Date;

  @Prop({
    required: false,
    type: Date,
    default: Date.now,
  })
  updated: Date;

  @Prop({
    required: false,
    type: Date,
    default: Date.now,
  })
  lastActive: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  this.updated = new Date();
  if (!this.isModified('password')) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

// TODO: after update, update the update field
// const updateMethods = ['findOneAndUpdate', 'update'];
