import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../../shared/enums/user.role';
import { UserAuthProvider } from '../../shared/enums/user.auth.provider';
import { hashSync } from 'bcrypt';
import {
  Document as MongooseDocument,
  UpdateQuery,
  SchemaTimestampsConfig,
} from 'mongoose';

export type UserDocument = User & MongooseDocument & SchemaTimestampsConfig;

@Schema({
  timestamps: true,
  versionKey: false,
  validateBeforeSave: true,
})
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
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.password = hashSync(this.password, 10);
  next();
});

UserSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as UpdateQuery<User>;
  if (update && update.password && typeof update.password == 'string') {
    update.password = hashSync(update.password, 10);
  }
  next();
});
