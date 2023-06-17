import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { upload } from "../config/multer";

class UserRoutes {
    private router: Router;
    private usersController: UserController;
    constructor() {
        this.router = Router();
        this.usersController = new UserController()
    }
    getRoutes() {
        //criar
        this.router.post('/', this.usersController.store.bind(this.usersController)
        );
        //editar
        this.router.put('/', upload.single('avata_url'),
            this.usersController.update.bind(this.usersController),
        );
        //login
        this.router.post('/auth', this.usersController.auth.bind(this.usersController))
        return this.router
    }
}

export { UserRoutes }