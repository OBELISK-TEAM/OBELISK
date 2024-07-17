import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../enums/user.role';
import { UserAuthProvider } from '../enums/user.auth.provider';
import { Board } from './board.schema';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
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
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Board',
    default: [],
  })
  boards: Board[];

  async comparePassword(attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});
