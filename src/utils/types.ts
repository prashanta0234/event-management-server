export interface JwtPayload {
  sub: string;
  role: string;
}

export enum Role {
  User = 'USER',
  Admin = 'ADMIN',
}

export interface Attendee {
  name: string;
  email: string;
}

export interface createEvent {
  name: string;
  description?: string;
  date: Date;
  location?: string;
}
