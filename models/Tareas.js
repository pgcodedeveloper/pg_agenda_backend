const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create the tasks schema

const TasksSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    fecha_entrega: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        required: true,
        default: false
    },
    prioridad: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    task_id:{
        type: String,
        required: true
    },
    task_list_id:{
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Tasks',TasksSchema);