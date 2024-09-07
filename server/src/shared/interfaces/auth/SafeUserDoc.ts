import { UserDocument } from '../../../schemas/user.schema';

export interface SafeUserDoc extends Omit<UserDocument, 'password'> {}
