import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User, UserRole } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

export class InitSeeder extends Seeder {
  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async run(em: EntityManager): Promise<void> {
    const users: User[] = [
      {
        auth_id: '7070afde-f8b5-487e-a288-f2be9d162b0b',
        email: 'user1@sample.com',
        password: 'trongcanphongco100nguoi',
        created_at: new Date(),
        role: UserRole.USER,
      },
      {
        auth_id: '893d0698-8564-4f10-9a7c-aba55dd82a69',
        email: 'user2@sample.com',
        password: 'emiutruonghcmus123',
        created_at: new Date(),
        role: UserRole.USER,
      },
      {
        auth_id: '6c1d902c-6966-4051-9186-5bc6c08c75c7',
        email: 'admin@sample.com',
        password: 'adminpassword123',
        created_at: new Date(),
        role: UserRole.ADMIN,
      },
    ];

    for (const user of users) {
      const newUser = em.create(User, {
        ...user,
        password: await this.hashPassword(user.password),
      });
      em.persist(newUser);
    }

    await em.flush();
  }
}
