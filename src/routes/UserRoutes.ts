import { Router } from "express";
import { UserController } from "../controllers/UserController";

class UserRoutes {
    private router: Router;
    private usersController: UserController;
    constructor() {
        this.router = Router();
        this.usersController = new UserController()
    }
    getRoutes() {

        this.router.post('/', this.usersController.store.bind(this.usersController)
        );

        this.router.put('/', this.usersController.update.bind(this.usersController),
        );

        return this.router
    }
}

export { UserRoutes }