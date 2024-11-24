import { UserDocument } from '../../../modules/mongo/schemas/user.schema';

export interface SafeUserDoc extends Omit<UserDocument, 'password'> {}
