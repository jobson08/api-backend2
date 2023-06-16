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
    async update( name: string, newPassword: string, avata_url: string ){
        const result = await prisma.user.update({
            where: {

            },
            data: {

            },
        })
    }
}

export {UserRepository}