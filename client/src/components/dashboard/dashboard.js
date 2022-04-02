import React, { useEffect, useState } from 'react';
import {decodeToken, isExpired} from 'react-jwt';
import { useNavigate } from 'react-router-dom';

const Dashboard = (props) => {
    const navigate = useNavigate();
    const [quote, setQuote] = useState('');
    const [tempQuote, setTempQuote] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const decodedToken = decodeToken(token);
        const expired = isExpired(token);
        if(decodedToken && decodedToken.email && !expired) {
            populateQuote();
        } else {
            localStorage.removeItem('token');
            navigate('/login')
        }
    }, []);

    const populateQuote = async() => {
        const req = await fetch('http://localhost:1337/api/quote', {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token'),
            },
        })
        const data = await req.json();
        if(data.status === 'ok') {
            setQuote(data.quote)
        } else {
            alert(data.error);
        }
    }
    const updateQuote = async(e) => {
        e.preventDefault();
        const req = await fetch('http://localhost:1337/api/quote', {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({
                quote: tempQuote
            })
        })
        const data = await req.json();
        console.log(data);
        if(data.status === 'ok') {
            setQuote(tempQuote)
            setTempQuote('')
        } else {
            alert(data.error)
        }
    }
    return (
        <div>
            <h1>Your Quotes</h1>
            <h3>{quote ? quote : 'No quotes'}</h3>
            <br/>
            <form onSubmit={updateQuote}> 
                <input type="text" placeholder="Quote" value={tempQuote} onChange={(e) => setTempQuote(e.target.value)} />
                <input type="submit" value="Update Quote" />
            </form>
        </div>
    )
}

export default Dashboard;