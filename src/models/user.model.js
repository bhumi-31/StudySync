import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true, "Username is required"],
        trim : true,
        minlength : 3,
        maxlength : 50,
    },

    email : {
        type : String,
        required : [true, "Email is required"],
        unique : true,
        lowercase : true,
        trim : true,
    },

    password : {
        type : String,
        required : [true, "Passowrd isrequired"],
        minlength : 8,
        select : false
    },

    role : {
        type : String,
        enum : ["student", "leader", "admin"],
        default : "student",
    },
},
   {
        timestamps : true
    }
)

const userModel = new mongoose.model("users", userSchema);

export default userModel;