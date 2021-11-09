import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { User } from "@modules/accounts/entities/User";

import { IUsersRepository } from "../IUserRepository";

class UsersRepositoryInMemory implements IUsersRepository {
  users: User[] = [];

  async create({
    driver_license,
    email,
    name,
    password,
  }: ICreateUserDTO): Promise<void> {
    const user = new User();

    Object.assign(user, {
      name,
      email,
      password,
      driver_license,
    });

    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.users.find((user) => user.email === email);

    return Promise.resolve(user);
  }

  async findById(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);

    return Promise.resolve(user);
  }
}

export { UsersRepositoryInMemory };