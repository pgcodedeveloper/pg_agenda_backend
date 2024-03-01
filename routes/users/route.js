const router = require('express').Router();
const Users = require('../../handlers/Users');
const Events = require('../../handlers/Events');
const Tasks = require('../../handlers/Tasks');

//Routers to manage events
router.post('/create-event',
    Users.createEvent,
    Events.createEvent
);

router.put('/update-event',
    Users.updateEvents,
    Events.updateEvents
);

router.post('/delete-event',
    Users.deleteEvents,
    Events.deleteEvents
);

router.get('/get-events',
    Events.getEvents
);

//Routers to manage tasks
router.post('/create-task',
    Users.createTask,
    Tasks.createTask
);

router.put('/update-task',
    Users.updateTask,
    Tasks.updateTask
);

router.post('/delete-task',
    Users.deleteTask,
    Tasks.deleteTask
);

router.get('/get-tasks',
    Tasks.getTasks
);

//Router to login users
router.get('/',
    Users.loginUser
);

router.get('/get-auth-token',
    Users.createToken
);

router.get('/get-user',
    Users.getUser
);

module.exports = router;