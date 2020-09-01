import { UserController } from '../controller/userController';
import { Auth } from '../middleware/auth';
import { validateInput } from '../shared/CustomValidation';

export class Routes {

    userController: UserController = new UserController();
    auth: Auth = new Auth();

    public routes(app: any): void {
        
        // signup
        app.route('/signUp').post(validateInput(), this.userController.createOrSignUpUser)

        // login
        app.route('/login').post(validateInput(), this.userController.loginUser)

        // create todo
        app.route('/createTodo').post(this.auth.authUser, this.userController.createTodo)

        // get all todo list
        app.route('/getAllTodo').get(this.auth.authUser, this.userController.getAllTodos)

        // update todo list
        app.route('/updateTodo/:id').patch(this.auth.authUser, this.userController.updateTodo)

        // delete todo
        app.route('/deleteTodo/:id').delete(this.auth.authUser, this.userController.deleteTodo)
    }
}
