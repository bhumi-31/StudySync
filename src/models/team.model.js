import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    teamName : {
        type : String,
        required : true,
        trim : true,
    },

    description : {
        type : String,
        trim : true
    },

    inviteCode: {
      type: String,
      unique: true,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: {
        users : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        role: {
          type: String,
          enum: ["leader", "member"],
          default: "member",
        },

        joinedAt: {
          type: Date,
          default: Date.now,
        },
    }
},
{
    timestamps : true,
}
)

const teamModel = new mongoose.model("teams", teamSchema);

export default teamModel;