import jwt from "jsonwebtoken";
import config from "../config/config";
import userModel from "../models/user.model";

export async function isAuthenticated(req, res) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await userModel.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = user;

        next();

    }catch(error){
        return res.status(401).json({
            message: "Invalid or Expired Token"
        });
    }
}