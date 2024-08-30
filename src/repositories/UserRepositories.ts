import { writerDataSource } from "../config/writerOrm.config";
import { dataSource } from "../config/orm.config";
import { User } from "../entities/User.entity";
import { DataSource, Repository } from "typeorm";

export async function createUser(first_name: string, last_name: string, email: string) {
    const userRepository = dataSource.getRepository(User);
    // const userRepository = writerDataSource.getRepository(User); //TypeORM will automatically direct write operations to the master database and read operations to one of the slave databases.
    const newUser = userRepository.create({
        first_name,
        last_name,
        email
    });

    await userRepository.save(newUser);
    return newUser;
}

export async function getAllUsers(): Promise<User[]> {
    const userRepository: Repository<User> = dataSource.getRepository(User);
    try {
      const users: User[] = await userRepository.find();
      console.log('Users retrieved:', users);
      return users;
    } catch (err) {
      console.error('Failed to retrieve users:', err);
      throw err;
    }
  }