import { NextFunction, Request, Response } from "express";
import { UserServices } from "../services/UserServices";

class UserController {
    private userServices: UserServices;
    constructor(){
        this.userServices = new UserServices();
    }

      //buscar todos
    index(){
      
    }
    //buscar um user
    show(){
        
    } 
    //criar
   async store(request: Request, response: Response, next: NextFunction) {
        const { name, email, password} = request.body;
        try{
            const result = await this.userServices.create({name, email, password});
            return response.status(201).json(result);
        }catch (error){
            next(error)
        }
    }
    //editar
    update(request: Request, response: Response, next: NextFunction){
        const { name, oldPassword, newPassword} = request.body;

        try{

        }catch (error){
            next(error);
        }
    }
     //autenticação
    auth(){
       
    }
}

export{UserController}