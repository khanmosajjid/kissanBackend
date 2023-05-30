const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name:{
        type: String
    },
    price:{
        type: Number
    },
    reward:{
        type: Number
    },
    

    

},{
    timestamps: true
});

module.exports = mongoose.model("Category", categorySchema);
