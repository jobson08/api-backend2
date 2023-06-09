import { compare, hash } from "bcrypt"
import { IUpdate, Icreate } from "../interfaces/usersInterface"
import { UserRepository } from "../repositories/UserRepository"
import { v4 as uuid } from 'uuid';
import { s3 } from "../config/aws";
import { sign, verify } from "jsonwebtoken"

class UserServices {
    private userRepository: UserRepository

    constructor() {
        this.userRepository = new UserRepository()
    }
    //criar
    async create({ name, email, password }: Icreate) {

        const findUser = await this.userRepository.findUserByEmail(email)

        if (findUser) {
            throw new Error('Usuario já existe')
        }

        const hashPassword = await hash(password, 10);

        const create = await this.userRepository.create({ name, email, password: hashPassword, });
        return create;
    }
    //Atualizar
    async update({ name, oldPassword, newPassword, avata_url, user_id }: IUpdate) {
        //caso o usuario passe  a senha
        let password
        if (oldPassword && newPassword) {
            const findUserById = await this.userRepository.findUserById(user_id)
            if (!findUserById) {
                throw new Error('Usuario não encontrado');
            }
            const passwordMatch = compare(oldPassword, findUserById.password);
            if (!passwordMatch) {
                throw new Error('Senha invalido');
            }
            password = await hash(newPassword, 10);
            await this.userRepository.updatePassword(password, user_id,);
        }
        // caso o usuario passe a imagens 
        if (avata_url) {
            const uploadImage = avata_url?.buffer;
            const uploadS3 = await s3
                .upload({
                    Bucket: 'system-finance',
                    Key: `${uuid()}-${avata_url?.originalname}`,
                    //  ACL: 'puclic-read',
                    Body: uploadImage,
                })
                .promise();
            console.log('url imegns', uploadS3.Location)
            await this.userRepository.update(name, uploadS3.Location, user_id)
        }
        return {
            user_id:{
                name
            },
            message: 'usuario atualizado com sucesso',
        }
    }
    //login
    async auth(email: string, password: string) {
        const findUser = await this.userRepository.findUserByEmail(email);
        if (!findUser) {
            throw new Error('Email ou senha ivalido')
        }
        const passwordMatch = await compare(password, findUser.password);

        if (!passwordMatch) {
            throw new Error('Email ou senha ivalido')
        }

        let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN
        if (!secretKey) {
            throw new Error('token não encontrado')
        }
        const token = sign({ email }, secretKey, {
            subject: findUser.id,
            expiresIn: 60 * 15,
        });
        //atualiza o token a cada 15 minutospega o token atigo compra e atualisa
        const refreshToken = sign({ email }, secretKey, {
            subject: findUser.id,
            expiresIn: '7d',
        });

        return {
            token,
            refresh_token: refreshToken,
            user: {
                name: findUser.name,
                email: findUser.email,
            },
        }
    }
    //atualiza token a cada 15 minitos
    async refresh(refresh_token: string){
      if (!refresh_token) {
        throw new Error('Refresh token ausente');
      }  
      let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN
      if (!secretKey) {
          throw new Error('não há token de atualização não chave');
      }
      const verifyRefrechToken = verify(refresh_token, secretKey);

      const {sub} = verifyRefrechToken;

      const newToken = sign({sub}, secretKey, {
        expiresIn: 60 * 15,
      });
       return {token: newToken};
    }
}

export { UserServices }