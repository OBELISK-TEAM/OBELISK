export interface UserResponseObject {
  _id: string;
  email: string;
  userRole: number;
  userAuthProvider: number;
  boards?: string[];
  slideObjects?: string[];
  lastActive?: Date;
  createdAt?: Date | string | boolean | undefined;
  updatedAt?: Date | string | boolean | undefined;
}
