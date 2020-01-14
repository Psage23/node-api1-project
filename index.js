// implement your API here
const express = require('express');
const Users = require('./data/db.js');
const server = express();

//get to "/"
server.get('/', (req, res) => {
    res.send({data: 'all the data'})
})

//middleware
server.use(express.json());
server.use(cors());

//create a user
server.post('/api/users', (req, res) => {
    const {name, bio} = req.body;
    if (!name || !bio) {
        res.status(400).json({errorMessage: 'Please provide name and bio for the user.'});
    }
    else {
        Users.insert(req.body)
        .then(createUser => {
            res.status(201).json(createUser);
        })
        .catch(() => {
            res.status(500).json({errorMessage: 'There was an error while saving the user to the database'})
        })
    }
    
})

//list of users
server.get('/api/users', (req, res) => {
    Users.find()
    .then(userList => {
        res.status(200).json(userList)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({errorMessage: "The users information could not be retrieved."})
    })
})

//list of users id
server.get('/api/users/:id', (req, res) => {
    Users.findById(req.params.id)
    .then(userID => {
        if(userID) {
            res.status(200).json(userID);
        }
        else {
            res.status(404).json({message: "The user with the specified ID does not exist."})
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({errorMessage: 'User could not be retrieved. '})
    })
})


//delete a user
server.delete('/api/users/:id', (req, res) => {
    Users.remove(req.params.id)
    .then(deleteUser => {
        if (deleteUser && deleteUser > 0) {
            res.status(200).json({message: 'user is deleted'})
        }
        else {
            res.status(404).json({message: "The user with the specified ID does not exist."})
        }
    })
    .catch(error => {
        res.status(500).json({error: "The user could not be removed" })
    })
})


//update a user
server.put('/api/users/:id', (req, res) => {
    const {name, bio} = req.body;
    if (!name || !bio) {
        res.status(400).json({errorMessage: 'Please provide name and bio for user.'})
    }
    else {
        Users.update(req.params.id, req.body)
        .then(updateUser => {
            if (updateUser) {
                res.status(200).json(updateUser);
            }
            else {
                res.status(404).json({errorMessage: 'User with specified id does not exist.'})
            }
        })
        .catch(() => {
            res.status(500).json({errorMessage: 'User could not be modified'})
        })
    }
})

const port = 8000;
server.listen(port, () => console.log('API online'));

