import { hash } from "bcrypt"
import { Icreate } from "../interfaces/usersInterface"
import { UserRepository } from "../repositories/UserRepository"

class UserServices {
    private userRepository: UserRepository

    constructor() {
        this.userRepository = new UserRepository()
    }
    async create({ name, email, password }: Icreate) {

        const findUser = await this.userRepository.findUserByEmail(email)

        if (findUser) {
            throw new Error('User existe')
        }

        const hashPassword = await hash(password, 10);

        const create = await this.userRepository.create({ name, email, password });
        return create;
    }
}

export { UserServices }