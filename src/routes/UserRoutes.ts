import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { upload } from "../config/multer";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

class UserRoutes {
    private router: Router;
    private usersController: UserController;
    private authMiddleware = new AuthMiddleware;
    constructor() {
        this.router = Router(); 
        this.usersController = new UserController();
        this.authMiddleware = new AuthMiddleware();
    } 
    getRoutes() {
        //criar
        this.router.post('/', this.usersController.store.bind(this.usersController)
        );
        //editar
        this.router.put('/', upload.single('avata_url'),
        this.authMiddleware.auth.bind(this.authMiddleware),
        this.usersController.update.bind(this.usersController),
        );
        //login
        this.router.post('/auth', this.usersController.auth.bind(this.usersController));
        this.router.post('/refesh', this.usersController.refresh.bind(this.usersController));
        return this.router
    }
}

export { UserRoutes }