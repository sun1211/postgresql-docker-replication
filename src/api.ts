import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import axios from 'axios';
import { getDBConnection, getWriteConnection } from './config/database.config';
import { createUser, getAllUsers } from './repositories/UserRepositories';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Routes
app.get('/check', (req, res) => {
    res.status(200).send('heath check OK');
});

//create user
app.post('/users', async (req, res) => {
    console.log(req.body)
    try {
        const { firstName, lastName, email } = req.body;
        const user = await createUser(firstName, lastName, email);
        res.status(201).json(user);
    } catch (error) {
        console.error('Failed to create user:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
});

//get users
app.get('/users', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Failed to retrieve users:', error);
        res.status(500).json({ message: 'Failed to retrieve users' });
    }
});


const appPort = 4000;
async function init() {
    await getDBConnection();
    await getWriteConnection(); //TypeORM will automatically direct write operations to the master database and read operations to one of the slave databases.

    return app.listen(appPort, () => {
        console.info(`Example app listening on port ${appPort}!`);
    });
}


/**
 * Start Express server.
 */
const server = init();
