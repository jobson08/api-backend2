import { prisma } from "../database/prisma";
import { Icreate } from "../interfaces/usersInterface";


class UserRepository{
   async create({ name, email, password }: Icreate){
        const result = await prisma.user.create({
            data:{
                 name,
                 email,
                 password,
            },
        });
        return result;
    }
    //verifiva se u usuario ja existe
    async findUserByEmail(email: string){
        const result = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        return result;
    }

    //verifiva se u usuario ja existe
    async findUserById(id: string){
        const result = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        return result;
    }
    async update( name: string,  avata_url: string, user_id: string ){
        const result = await prisma.user.update({
            where: {
                id: user_id,
            },
            data: {
                name,
                avata_url,
            },
        });
        return result;
    }
    //atualizar nava senha
    async updatePassword( newPassword: string, user_id: string){
        const result = await prisma.user.update({
            where:{
                id: user_id,
            },
            data: {
                password: newPassword,
            }
        })
    }
}

export {UserRepository}