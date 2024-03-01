const { google } = require('googleapis');
const Usuarios = require('../models/Usuarios');

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

exports.loginUser = async(req, res, next)=>{
    try {
        const scope = [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/plus.me',
            'https://www.googleapis.com/auth/calendar', 
            'https://www.googleapis.com/auth/calendar.events',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/tasks',
            'https://www.googleapis.com/auth/tasks.readonly'
        ]
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scope,
        });

        res.status(200).json(authUrl);
    } catch (error) {
        next(error);
    }
}

exports.createToken = async(req, res, next) => {
    const code = req.query.code;
    oauth2Client.getToken(code, async(err, tokens) =>{
      // Now tokens contains an access_token and an optional refresh_token. Save them.
      if(!err) {
        oauth2Client.setCredentials(tokens);
        const { email,data } = await getUserInfo(tokens.access_token);  
        try {
            //Evaluate if the user is authenticated
            const usuarioExist = await Usuarios.findOne({email: email });
            if(!usuarioExist){
                const usuario = new Usuarios();
                usuario.email = email;
                usuario.dispalyNames = data.names[0].displayName;
                usuario.photoURL = data.photos[0].url;
                usuario.dateExpire = tokens.expiry_date;
                usuario.tokenId = tokens.access_token;
                usuario.refreshToken = tokens?.refresh_token || "null";
                //Save the session then redirect the user to http://localhost:3000
                await usuario.save();
            }
            else{
                
                if(tokens.access_token != usuarioExist.tokenId){
                    usuarioExist.dispalyNames = data.names[0].displayName;
                    usuarioExist.photoURL = data.photos[0].url;
                    usuarioExist.dateExpire = tokens.expiry_date;
                    usuarioExist.tokenId = tokens.access_token;
                    usuarioExist.refreshToken = tokens?.refresh_token || usuarioExist.refreshToken;
                    await usuarioExist.save();
                }
            }
            res.redirect(process.env.FRONT_END);
        } catch (error) {
            console.error('Error saving to session storage: ', err);
            return next(new Error('Error creating user'));
        }
        
      }
      else{
        //Redirect the user to http://localhost:3000/login
        res.redirect(process.env.FRONT_END + '/login');
      }
    });
}

async function getUserInfo(access_token){
    const {email} = await oauth2Client.getTokenInfo(access_token);
    const { data } = await google.people('v1').people.get({
        auth: oauth2Client,
        personFields: 'names,photos',
        resourceName: 'people/me',

    });
    return {
        email,
        data: data
    }
}
exports.getUser = async(req, res, next) =>{
    const refresh_token = req.query.refresh_token;

    if(refresh_token == "null"){
        const { access_token } = oauth2Client.credentials;
        const { email } = await getUserInfo(access_token);
        const usuarioExist = await Usuarios.findOne({email: email });
        
        if(usuarioExist){
            res.status(200).json(usuarioExist.toJSON());
        }
        else{
            res.status(404).json({msg: "No existe el usuario", isAuth: false});
        }
    }
    else{
        const usuarioExist = await Usuarios.findOne({refreshToken: refresh_token });
        
        if(usuarioExist){
            res.status(200).json(usuarioExist.toJSON());
        }
        else{
            res.status(404).json({msg: "No existe el usuario", isAuth: false});
        }
    }
}

exports.createEvent = async(req, res, next)=>{
    const { event, user } = req.body;
    try {
        if(!user){
            res.status(403).json({msg: "No tienes permisos"});
            return;
        }
        //Create the contstant of calendar
        const calendar = google.calendar('v3');
        //Set the credentials for the calendar
        oauth2Client.setCredentials({refresh_token: user.refreshToken});
        
        //Build the Object to send into request
        const eventRef = {
            'summary': event.evento,
            'description': event.descripcion,
            'start': {
              'dateTime': `${event.fecha_inicio}:00`,
              'timeZone': 'America/Montevideo',
            },
            'end': {
              'dateTime': `${event.fecha_fin}:00`,
              'timeZone': 'America/Montevideo',
            },
            'reminders': {
              'useDefault': false,
              'overrides': [
                {'method': event.recordatorio.type, 'minutes': event.recordatorio.minutes},
              ],
            },
        };

        calendar.events.insert({
            auth: oauth2Client,
            calendarId: "primary",
            resource: eventRef,
        }, (err, result) =>{
            if(err){
                res.status(400).json({msg: "Error al crear el evento en Google Calendar", error: err});
            }
            else{
                event.event_id = result.data.id;
                event.autor = user.email;
                req.body = {event,user};
                return next();
            }
        });
    } catch (error) {
        next(error);
    }
}

exports.updateEvents = async(req, res, next) =>{
    const { event, user } = req.body;
    try {
        if(!user){
            res.status(403).json({msg: "No tienes permisos"});
            return;
        }
        //Create the contstant of calendar
        const calendar = google.calendar('v3');
        //Set the credentials for the calendar
        oauth2Client.setCredentials({refresh_token: user.refreshToken});
        
        //Build the Object to send into request
        const eventRef = {
            'summary': event.evento,
            'description': event.descripcion,
            'start': {
              'dateTime': `${event.fecha_inicio}:00`,
              'timeZone': 'America/Montevideo',
            },
            'end': {
              'dateTime': `${event.fecha_fin}:00`,
              'timeZone': 'America/Montevideo',
            },
            'reminders': {
              'useDefault': false,
              'overrides': [
                {'method': event.recordatorio.type, 'minutes': event.recordatorio.minutes},
              ],
            },
        };
        calendar.events.update({
            auth: oauth2Client,
            calendarId: "primary",
            eventId: event.event_id,
            resource: eventRef,
        }, (err) =>{
            if(err){
                res.status(400).json({msg: "Error al actualizar el evento en Google Calendar", error: err});
            }
            else{
                req.body = {event,user};
                return next();
            }
        })
    } catch (error) {
        next(error);
    }
}

exports.deleteEvents = async(req, res, next) =>{
    const { event, user } = req.body;
    try {
        if(!user){
            res.status(403).json({msg: "No tienes permisos"});
            return;
        }
        //Create the contstant of calendar
        const calendar = google.calendar('v3');
        //Set the credentials for the calendar
        oauth2Client.setCredentials({refresh_token: user.refreshToken});
        
        calendar.events.delete({
            auth: oauth2Client,
            calendarId: "primary",
            eventId: event.event_id,
        }, (err) =>{
            if(err){
                res.status(400).json({msg: "Error al eliminar el evento en Google Calendar", error: err});
            }
            else{
                req.body = {event,user};
                return next();
            }
        })
    } catch (error) {
        next(error);
    }
}

exports.createTask = async(req,res,next) =>{
    const { task, user } = req.body;
    try {
        if(!user){
            res.status(403).json({msg: "No tienes permisos"});
            return;
        } 

        const tasks = google.tasks('v1');
        oauth2Client.setCredentials({refresh_token: user.refreshToken});
        //Get the tasksList
        const request = await tasks.tasklists.list({
            auth: oauth2Client,
            maxResults: 1
        });
        const tasksList = request.data.items;
        if(tasksList && tasksList.length > 0){
            const { id, etag } = tasksList[0];
            tasks.tasks.insert({
                auth: oauth2Client,
                requestBody:{
                    title: task.titulo,
                    etag: etag.toString(),
                    notes: task.descripcion,
                    status: "needsAction",
                    due: task.fecha_entrega + ":00.000Z"
                },
                tasklist: id.toString()
            },(err, results) =>{
                if(err){
                    res.status(400).json({msg: "Error al crear la tarea en Google Calendar", error: err});
                }
                else{
                    task.task_id = results.data.id;
                    task.task_list_id = id.toString();
                    task.autor = user.email;
                    req.body = {task,user}
                    return next();
                }
            });
        }
        else{
            return res.status(500).json({msg: "No tienes una lista de tareas creadas, dirigete al calendario y crea una.", error: true});
        }
    } catch (error) {
        next(error);
    }
}

exports.updateTask = async(req,res,next) =>{
    const { task, user } = req.body;
    try {
        if(!user){
            res.status(403).json({msg: "No tienes permisos"});
            return;
        }
        const tasks = google.tasks('v1');
        oauth2Client.setCredentials({refresh_token: user.refreshToken});
        
        //Update the task
        tasks.tasks.update({
            auth: oauth2Client,
            task: task.task_id,
            requestBody:{
                id: task.task_id,
                title: task.titulo,
                notes: task.descripcion,
                status: task.estado ? "completed" : "needsAction",
                due: task.fecha_entrega + ":00.000Z"
            },
            tasklist: task.task_list_id,
        },(err) => {
            if(err){
                res.status(400).json({msg: "Error al actualizar la tarea en Google Calendar", error: err});
            }
            else{
                req.body = {task,user}
                return next();
            }
        });
    }catch(error) {
        next(error);
    }
}

exports.deleteTask = async(req,res,next) =>{
    const { task, user } = req.body;
    try {
        if(!user){
            res.status(403).json({msg: "No tienes permisos"});
            return;
        }
        const tasks = google.tasks('v1');
        oauth2Client.setCredentials({refresh_token: user.refreshToken});
        
        //Delete the task
        tasks.tasks.delete({
            auth: oauth2Client,
            task: task.task_id,
            tasklist: task.task_list_id,
        },(err) => {
            if(err){
                res.status(400).json({msg: "Error al eliminar la tarea en Google Calendar", error: err});
            }
            else{
                req.body = {task,user}
                return next();
            }
        });
    }catch(error) {
        next(error);
    }
}
/*
    Colors IDs to google calendar
    1 blue
    2 green
    3 purple
    4 red
    5 yellow
    6 orange
    7 turquoise
    8 gray
    9 bold blue
    10 bold green
    11 bold red
*/