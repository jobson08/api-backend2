import { hash } from "bcrypt"
import { IUpdate, Icreate } from "../interfaces/usersInterface"
import { UserRepository } from "../repositories/UserRepository"
import { v4 as uuid } from 'uuid';
import { s3 } from "../config/aws";
import { randomUUID } from "crypto"

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
   async update({name, oldPassword, newPassword, avata_url}: IUpdate){
        const uploadImage = avata_url?.buffer;
        const uploadS3 = await s3
        .upload({
            Bucket: 'system-finance',
            Key: `${uuid()}-${avata_url?.originalname}`,
          //  ACL: 'puclic-read',
            Body: uploadImage,
        })
        .promise();
        console.log('url imegns' , uploadS3.Location)
    }
}

export { UserServices }