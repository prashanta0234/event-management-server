export interface JwtPayload {
  sub: string;
  role: string;
}

export enum Role {
  User = 'USER',
  Admin = 'ADMIN',
}

export interface createEvent {
  name: string;
  description?: string;
  date: Date;
  location?: string;
}
