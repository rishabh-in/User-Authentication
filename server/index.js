import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from './model/user.model.js';
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/Authentication')

app.get('/hello', async(req, res) => {
    res.send("Hello world");
    
})  
app.post('/api/register', async(req, res) => {
    let {userData} = req.body;
    console.log(userData);
    try {
        const user = await User.create({
            name: userData.firstName,
            email: userData.email,
            password: userData.password
        })
        res.json({status: 'ok'});
    } catch (error) {
        console.log(error)
        res.json({status: 'error', error: "Duplicate value"})
    }
    
})

app.post('/api/login', async (req, res) => {
    console.log(req.body);
    const {userData} = req.body
    const user = await User.findOne({
        email: userData.email,
        password: userData.password
    });
    if (user) { 
        const token = jwt.sign({
            email: user.email,
            name: user.name
        }, 'secret123')
        return res.json({status: 'ok', user: token})
    } else {
        return res.json({status: 'error'});
    }
})

app.listen(1337, () => {
    console.log("app running on 1337");
})