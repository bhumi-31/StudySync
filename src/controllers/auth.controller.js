import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import bcrypt from "bcrypt";


export async function register(req, res) {
    try{

        const {username, email, password} = req.body;
    
        if(!username || !email || !password){
            return res.status(400).json({
                message : "All fields are required"
            });
        }
    
        const isAlreadyRegistered = await userModel.findOne({
            $or : [
                {username},
                {email}
            ]
        })
    
    
        if(isAlreadyRegistered){
            return res.status(409).json({
                message : "Username or email is already exists"
            })
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = await userModel.create({
            username,
            email,
            password : hashedPassword
        })
    
        res.status(201).json({
                success: true,
                message: "User registered successfully",
                user
        });
    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}


export async function login(req, res) {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "Email and password are required"
            });
        };

        const user = await userModel
            .findOne({email : email.trim().toLowerCase()})
            .select("+password");

        if(!user){
            return res.status(401).json({
                message : "Invalid credentials"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({
                message : "Invalid credentials"
            })
        }

        const token = jwt.sign({
            userId : user._id
        }, config.JWT_SECRET,
        {
            expiresIn : "1d"
        });

        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });


    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}