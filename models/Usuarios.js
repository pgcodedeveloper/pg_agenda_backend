const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create the usuarios schema

const UsuariosSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    dispalyNames:{
        type: String,
        required: true
    },
    photoURL:{
        type: String,
        required: false
    },
    tokenId:{
        type: String,
        required: true
    },
    dateExpire: {
        type: Number,
        required: true
    },
    refreshToken:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Usuarios",UsuariosSchema);