export enum UserRole {
  // can change roles, delete users, etc.
  ADMIN = 100,

  // can delete users, create/delete/modify boards, etc.
  MEMBER = 10,

  // regular user can create/delete/modify/share boards, etc.
  USER = 1,
}
