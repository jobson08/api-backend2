import { compare, hash } from "bcrypt"
import { IUpdate, Icreate } from "../interfaces/usersInterface"
import { UserRepository } from "../repositories/UserRepository"
import { v4 as uuid } from 'uuid';
import { s3 } from "../config/aws";
import{sign} from "jsonwebtoken"

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

   async auth( email: string, password: string){
        const findUser = await this.userRepository.findUserByEmail(email);
        if (!findUser) {
            throw new Error('User or password invalid')
        }
        const passwordMatch = compare(password, findUser.password);

        if (!passwordMatch) {
            throw new Error('User or password invalid')
        }

        let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN
            if (!secretKey){
                throw new Error('token não encontrado')
            }
        const token = sign({ email }, secretKey, {
            subject: findUser.id,
            expiresIn: 60 * 15,
        });
        return {
            token,
            user: {
                name: findUser.name,
                email: findUser.email,
            },
        }
    }
}

export { UserServices }