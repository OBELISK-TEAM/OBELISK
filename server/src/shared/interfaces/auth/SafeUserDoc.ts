import { UserDocument } from '../../../mongo/schemas/user.schema';

export interface SafeUserDoc extends Omit<UserDocument, 'password'> {}
