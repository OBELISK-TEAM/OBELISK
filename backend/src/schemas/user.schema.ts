import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../enums/user.role';
import { UserAuthProvider } from '../enums/user.auth.provider';
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
