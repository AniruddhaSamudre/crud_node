import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt  from 'jsonwebtoken';
import { userModel } from '../models/userModel'
import { todoModel } from './../models/todoModel';

export class UserController {

    async createOrSignUpUser(req: Request, res: Response) {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {

            let temp = errors.array();
            let obj  = {
                'message': temp[0].msg,
                'status': 400
            }
            return res.status(400).send({ error: obj })
        }

        let { email, password } = req.body

        try {
            let user: any = await userModel.findOne({ email })
            if(user) {
                return res.status(400).send({
                    message: 'User Already Exists',
                    status: 400
                })
            }

            const salt = await bcrypt.genSalt(10)
            password = await bcrypt.hash(password, salt)

            user = new userModel({
                email, 
                password 
            })

            await user.save()

            delete user._doc.password;
            delete user._doc.token;

            let  responseData = {
                'message': 'OK',
                'status': 200,
                'data': user
            }

            res.status(200).send(responseData)

        } catch(e) {
            res.status(500).send("Error in Saving"); 
        }
    }

    async loginUser(req: Request, res: Response) {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {

            let temp = errors.array();
            let obj  = {
                'message': temp[0].msg,
                'status': 400
            }
            return res.status(400).send({ error: obj })
        } 
        
        const  { email, password } =  req.body;

        try {
            let user:any = await userModel.findOne({ email })

            if(!user) {
                return res.status(400).send({
                    message: 'User Not Exist',
                    status: 400
                })
            }
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).send({
                    message: "Incorrect Password !",
                    status: 400
                })
            }
           
            const token = jwt.sign( { _id: user.id.toString() }, "randomString") 
            
            user.token = token
            
            await user.save();
            
            delete user._doc.password;
            delete user._doc.token;

            let  responseData = {
                'message': 'OK',
                'status': 200,
                'data': {user, token}
            }

            res.status(200).send(responseData)

        } catch(e) {
            res.status(500).send({
                message: "Server Error",
                status: 500
            });
        }
    }

    async createTodo(req: Request, res: Response) {

        let { title, description, completed } = req.body

        try {
            let todo = new todoModel({
                title, 
                description, 
                completed 
            })

            await todo.save()

            let  responseData = {
                'message': 'OK',
                'status': 200,
                'data': todo
            }

            res.status(200).send(responseData)

        } catch(e) {
            res.status(500).send("Error in Saving"); 
        }
    }

    async getAllTodos(req: Request, res: Response) {
        try {
            const todos:any = await todoModel.find({})

            let responseObj = {
                'message': 'OK',
                'status': 200,
                'data': todos
           }
           res.status(200).send(responseObj)
           
        } catch(e) {
            res.status(500).send(e)
        }
    }

    async updateTodo(req: Request, res: Response) {
        try {
            // const data:any = await todoModel.findById({_id:req.params.id});

            await todoModel.findByIdAndUpdate({_id:req.params.id}, req.body);

            let responseObj = {
                'message': 'OK',
                'status': 200
            }

            res.status(200).send(responseObj)

        } catch(e) {
            res.status(400).send(e)
        }

    }

    async deleteTodo(req: Request, res: Response) {
        try {
            await todoModel.findByIdAndDelete({_id:req.params.id})

            let responseObj = {
                'message': 'OK',
                'status': 200
            }
    
            res.send(responseObj)
    
        } catch (e) {
            res.status(500).send()
        }
    }
}   