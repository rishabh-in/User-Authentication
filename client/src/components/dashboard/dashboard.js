import React, { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useNavigate } from 'react-router-dom';

const Dashboard = (props) => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            const user = jwt.decode(token);
            if(!user) {
                localStorage.removeItem('token');
                navigate.replace('/login')
            } else {
                populateQuote()
            }
        }
    }, []);

    const populateQuote = async() => {
        const req = await fetch('http://localhost:1337/api/quote', {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token'),
            },
        })

        const data = req.json();
        console.log(data);
    }

    return (
        <div>Quotes</div>
    )
}

export default Dashboard;