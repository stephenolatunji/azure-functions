const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const distributorSchema = new Schema({
    ID: {type: String},
    name: {type: String},
    password: {type: String},
    activated: {type: Boolean, default: false},
    lastLogin: {type: String},
    drapPoint: [
        {
            id: {
                type: Schema.Types.ObjectId,
                ref: "Drop",
                default: null,
                autopopulate: true
            },

        }
    ],
    
})