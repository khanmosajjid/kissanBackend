const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    walletAddress:{
        type: String,
        require:true
    },
    role:{
        type: String,
        default: "user"
    },
    referralStakedBalance:{
        type:Number,
        default:0
    }
},{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
