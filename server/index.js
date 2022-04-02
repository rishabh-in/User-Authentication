import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from './model/user.model.js';
import bcrypt from 'bcryptjs';
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
        const newPassword = await bcrypt.hash(userData.password, 10);
        const user = await User.create({
            name: userData.firstName,
            email: userData.email,
            password: newPassword
        })
        res.json({status: 'ok'});
    } catch (error) {
        console.log(error)
        res.json({status: 'error', error: "Duplicate value"})
    }
    
})

app.post('/api/login', async (req, res) => {
    try {
        console.log(req.body);
        const {userData} = req.body
        const user = await User.findOne({
            email: userData.email,
        });
        const isPasswordValid = await bcrypt.compare(userData.password, user.password)
        if (user && isPasswordValid) { 
            const token = jwt.sign({
                email: user.email,
                name: user.name
            }, 'secret123', {expiresIn: '1h'});
            return res.json({status: 'ok', user: token})
        } else {
            return res.json({status: 'error'});
        }
    } catch (error) {
        console.log(error);
    }
    
});

app.get('/api/quote', async (req, res) => {
    const token = req.header('x-access-token');
    try {
        const decoded = jwt.verify(token, 'secret123');
        const email = decoded.email;
        const user = await User.findOne({email: email});
        return res.json({status: 'ok', quote: user.quote});
    } catch (error) {
        console.log(error);
        res.json({status: 'error', error: 'invalid token'})
    }
})
app.post('/api/quote', async (req, res) => {
    const token = req.header('x-access-token');
    const quote = req.body.quote;
    try {
        const decoded = jwt.verify(token, 'secret123');
        const email = decoded.email;
        const user = await User.updateOne({email: email}, {$set: {quote: quote}});
        return res.json({status: 'ok'});
    } catch (error) {
        console.log(error);
        res.json({status: 'error', error: 'invalid token'})
    }
})

app.listen(1337, () => {
    console.log("app running on 1337");
})