export interface JwtPayload {
  sub: string;
  role: string;
}

export enum Role {
  User = 'user',
  Admin = 'admin',
}
