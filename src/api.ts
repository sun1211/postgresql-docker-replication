import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import axios from 'axios';


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

// Start
const appPort = 4000;
app.listen(appPort, () => {
    console.info(`Example app listening on port ${appPort}!`);
});
