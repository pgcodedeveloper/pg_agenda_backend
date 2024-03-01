const Tareas = require('../models/Tareas')
const Usuarios = require('../models/Usuarios')
exports.createTask = async(req,res,next) =>{
    const {task, user} = req.body;

    try {
        const existUser = await Usuarios.findOne({email: user.email});
        if(!existUser) {
            return res.status(403).json({msg: "Usuario no autorizado",error: true});
        }
        const taskData = new Tareas();
        taskData.titulo = task.titulo;
        taskData.descripcion = task.descripcion;
        taskData.fecha_entrega = task.fecha_entrega;
        taskData.autor = task.autor;
        taskData.color = task.color;
        taskData.estado = false;
        taskData.prioridad = task.prioridad;
        taskData.task_id = task.task_id;
        taskData.task_list_id = task.task_list_id;
        await taskData.save();
        res.status(200).json({msg: "Tarea creada", payload: taskData.toJSON()});
    } catch (error) {
        res.status(400).json({msg: "Error al crear la tarea"});
    }
}

exports.updateTask = async(req,res,next) =>{
    const {task, user} = req.body;
    
    try {
        const existUser = await Usuarios.findOne({email: user.email});
        if(!existUser) {
            return res.status(403).json({msg: "Usuario no autorizado",error: true});
        }
        const taskData = await Tareas.findById(task._id);
        if(taskData){
            taskData.titulo = task.titulo || taskData.titulo;
            taskData.descripcion = task.descripcion || taskData.descripcion;
            taskData.fecha_entrega = task.fecha_entrega || taskData.fecha_entrega;
            taskData.color = task.color;
            taskData.estado = task.estado;
            taskData.prioridad = task.prioridad || taskData.prioridad;
            await taskData.save();
            res.status(200).json({msg: "Tarea actualizada", payload: taskData.toJSON()});
        }else{
            return res.status(404).json({msg:"Tarea no existe",error: true});
        }
    } catch (error) {
        res.status(400).json({msg: "Error al actualizar la tarea"});
    }
}

exports.deleteTask = async(req,res,next) =>{
    const {task, user} = req.body;
    
    try {
        const existUser = await Usuarios.findOne({email: user.email});
        if(!existUser) {
            return res.status(403).json({msg: "Usuario no autorizado",error: true});
        }
        const taskData = await Tareas.findById(task._id);
        if(taskData){
            await taskData.deleteOne();
            res.status(200).json({msg: "Tarea eliminada"});
        }
        else{
            return res.status(404).json({msg:"Tarea no existe",error: true});
        }
    } catch (error) {
        res.status(400).json({msg: "Error al actualizar la tarea"});
    }
}

exports.getTasks = async(req,res,next) =>{
    const user = req.query.user;    
    try {
        const existUser = await Usuarios.findOne({email: user});
        if(!existUser) {
            return res.status(403).json({msg:"Usuario no autorizado",error: true});
        }
        const taskData = await Tareas.find({autor: user}).select("-__v");
        res.status(200).json(taskData);
        
    } catch (error) {
        res.status(400).json({msg: "Error al obtener las tareas"});
    }
}