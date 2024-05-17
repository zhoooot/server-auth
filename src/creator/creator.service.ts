import { Creator } from '../entities/creator.entity';
import { EntityManager } from '@mikro-orm/mysql';

export class CreatorService {
  constructor(private readonly em: EntityManager) {}

  async createCreator(creator: { id: string }): Promise<Creator> {
    const { id } = creator;
    const new_user = new Creator();
    new_user.id = id;
    await this.em.persistAndFlush(new_user);
    return new_user;
  }

  getCreator(id: string) {
    return this.em.findOne(Creator, {
      id: id,
    });
  }

  async getAllCreators(): Promise<Creator[]> {
    return await this.em.find(Creator, {});
  }

  async updateCreator(creator: Creator): Promise<Creator> {
    const { id, fullname, institution, phone } = creator;
    const user: Creator = await this.em.findOne(Creator, {
      id: id,
    });
    user.fullname = fullname;
    user.phone = phone;
    user.institution = institution;
    await this.em.persistAndFlush(user);
    return user;
  }

  async deleteCreator(id: string): Promise<Creator> {
    const user = await this.em.findOne(Creator, {
      id: id,
    });
    await this.em.removeAndFlush(user);
    return user;
  }

  async getCreatorByEmail(email: string): Promise<Creator> {
    const connection = this.em.getConnection();
    const creator: Promise<Creator> = connection.execute(
      'SELECT creator.* FROM creator JOIN auth WHERE email = ?',
      [email],
    );
    return creator;
  }
}

// @Injectable()
// export class CreatorService {
//   constructor(
//     @InjectRepository(Creator)
//     private usersRepository: Repository<Creator>,
//     private amqpConnection: AmqpConnection,
//   ) {}

//   @RabbitSubscribe({
//     exchange: 'user',
//     routingKey: 'user.register',
//     queue: 'creator',
//   })
//   async createCreator(creator: { id: string }): Promise<Creator> {
//     const { id } = creator;
//     const new_user = new Creator();
//     new_user.id = id;
//     await this.usersRepository.save(new_user);
//     return new_user;
//   }

//   getCreator(id: string) {
//     return this.usersRepository.findOne({
//       where: {
//         id: id,
//       },
//     });
//   }

//   async getAllCreators(): Promise<Creator[]> {
//     return await this.usersRepository.find({
//       select: {
//         id: true,
//         fullname: true,
//         phone: true,
//         institution: true,
//       },
//     });
//   }

//   async updateCreator(creator: Creator): Promise<Creator> {
//     const { id, fullname, institution, phone } = creator;
//     const user = await this.usersRepository.findOne({
//       where: {
//         id: id,
//       },
//     });
//     user.fullname = fullname;
//     user.phone = phone;
//     user.institution = institution;
//     await this.usersRepository.save(user);
//     return user;
//   }

//   async deleteCreator(id: string): Promise<Creator> {
//     const user = await this.usersRepository.findOne({
//       where: {
//         id: id,
//       },
//     });
//     await this.usersRepository.delete(id);

//     this.amqpConnection.publish('user', 'user.delete', {
//       id: id,
//     });

//     return user;
//   }
// }
