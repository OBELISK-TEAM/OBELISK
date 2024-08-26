export interface UserResponseObject {
  _id: string;
  email: string;
  userRole: number;
  userAuthProvider: number;
  boards?: string[];
  slideObjects?: string[];
  lastActive?: Date;
  createdAt?: string;
  updatedAt?: string;
}
