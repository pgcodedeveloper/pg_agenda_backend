const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create the Eventos schema

const EventsSchema = new Schema({
    evento: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    fecha_inicio: {
        type: String,
        required: true
    },
    fecha_fin: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    event_id:{
        type: String,
    },
    autor: {
        type: String,
        required: true
    },
    recordatorio: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model("Events",EventsSchema);