const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    id: {
        type: String,
        auto: true 
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model("Category", categorySchema);
