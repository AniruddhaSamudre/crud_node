import { NextFunction, Response } from 'express';
import jwt  from 'jsonwebtoken';

import { userModel } from '../models/userModel';
import { IGetUserAuthInfoRequest } from '../shared/requestModel';

export class Auth {

    async authUser (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
        const token = req.header("token")

        if (!token) {
            return res.status(401).send({ 
                message: "Auth Error",
                status: 401
            });
        }

        try {
            const decode: any = jwt.verify(token, "randomString")
            const user = await userModel.findOne({ _id: decode._id, 'token': token })

            if(!user) {
                throw new Error()
            }

            req.token = token;
            // req.user = user;
 
            next()
        } catch(e) {
            res.status(401).send({ 
                message: "Please Authenticate",
                status: 401
            }); 
        }
    }
}