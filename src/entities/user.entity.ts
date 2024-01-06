import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid' })
  auth_id: string = uuidv4();

  @Property({ type: 'text' })
  email: string;

  @Property({ type: 'text' })
  password: string;

  @Enum({ items: () => UserRole, default: UserRole.USER })
  role: UserRole;

  @Property({ type: 'date' })
  created_at: Date = new Date();
}
