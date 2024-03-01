const Eventos = require('../models/Eventos');
const Usuarios = require('../models/Usuarios');

exports.createEvent = async(req, res, next)=>{
    const { event,user } = req.body;
    try {
        const existUser = await Usuarios.findOne({email: user.email});
        if(!existUser) {
            return res.status(403).json({msg: "Usuario no autorizado",error: true});
        }
        //Save the event data into database
        const eventData = new Eventos();
        eventData.evento = event.evento;
        eventData.descripcion = event.descripcion;
        eventData.fecha_inicio = event.fecha_inicio;
        eventData.fecha_fin = event.fecha_fin;
        eventData.autor = event.autor;
        eventData.color = event.color;
        eventData.event_id = event.event_id;
        eventData.recordatorio = event.recordatorio;
        await eventData.save();
        res.status(200).json({msg: "Evento creado", payload: eventData.toJSON()});
    } catch (error) {
        res.status(400).json({msg: "Error al crear el evento"});
    }
} 

exports.updateEvents = async(req, res, next)=>{
    const { event,user } = req.body;
    
    try {
        const existUser = await Usuarios.findOne({email: user.email});
        if(!existUser) {
            return res.status(403).json({msg: "Usuario no autorizado",error: true});
        }

        //Find the event to update
        const eventData = await Eventos.findById(event._id);
        if(!eventData){
            return res.status(404).json({msg: "No existe el evento" ,error: true});
        }

        if(eventData.autor !== event.autor){
            return res.status(403).json({msg: "No tienes permisos para actualizar este evento",error: true});
        }
        eventData.evento = event.evento || eventData.evento;
        eventData.descripcion = event.descripcion || eventData.descripcion;
        eventData.fecha_inicio = event.fecha_inicio || eventData.fecha_inicio;
        eventData.fecha_fin = event.fecha_fin || eventData.fecha_fin;
        eventData.color = event.color || eventData.color;
        eventData.recordatorio = event.recordatorio || eventData.recordatorio;
        await eventData.save();
        res.status(200).json({msg: "Evento actualizado", payload: eventData.toJSON()});
    } catch (error) {
        res.status(400).json({msg: "Error al actualizar el evento"});
    }
}

exports.deleteEvents = async(req, res, next) => {
    const { event,user } = req.body;

    try {
        const existUser = await Usuarios.findOne({email: user.email});
        if(!existUser) {
            return res.status(403).json({msg: "Usuario no autorizado",error: true});
        }

        //Find the event to delete
        const eventData = await Eventos.findById(event._id);
        if(!eventData){
            return res.status(404).json({msg: "No existe el evento" ,error: true});
        }
        //Delete the event from the database
        await eventData.deleteOne();
        res.status(200).json({msg: "Evento eliminado"});
    } catch (error) {
        res.status(400).json({msg: "Error al eliminar el evento"});
    }
}

exports.getEvents = async(req, res, next)=>{
    const user = req.query.user;
    try {
        const existUser = await Usuarios.findOne({email: user});
        if(!existUser) {
            return res.status(403).json({msg: "Usuario no autorizado",error: true});
        }
        const eventos = await Eventos.find({autor: user}).select("-__v");
        res.status(200).json(eventos);
    } catch (error) {
        res.status(400).json({msg: "Error al obtener los eventos"});
    }
}