import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
import { useCookies } from 'react-cookie'
import axios from 'axios'

import memories from '../../images/memories.png';
import * as actionType from '../../constants/actionTypes';
import useStyles from './styles';


const Navbar = () => {

    const classes = useStyles();

    const [user, setUser] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const userId = cookies.UserId
    let navigate = useNavigate()

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: { userId }
            })
            setUser(response.data)

        } catch (error) {
            console.log(error)
        }
    }

    const logout = () => {
        removeCookie('UserId', cookies.UserId)
        removeCookie('AuthToken', cookies.AuthToken)
        navigate("/")
        window.location.reload()
        navigate("/")

    }
    const goBack = () => {
        navigate("/dashboard")
    }

    const handletitle = () => {
        navigate("/post")
        window.location.reload()
    }

    useEffect(() => {
        getUser()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <div className={classes.brandContainer}>
                <Button variant="contained" className={classes.goback} color="primary" onClick={goBack}>Back</Button>
                <Typography component={Link} onClick={handletitle} className={classes.heading} variant="h2" align="center"><b>Posts</b></Typography>
                <img className={classes.image} src={memories} alt="icon" height="60" />
            </div>
            <Toolbar className={classes.toolbar}>
                <div className={classes.profile}>
                    <Avatar className={classes.purple} alt={user?.name} src={user?.url}>{user?.name.charAt(0)}</Avatar>
                    <Typography className={classes.name} variant="h6">{user?.name}</Typography>

                    <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
                </div>

            </Toolbar>
        </AppBar>
    );
};

export default Navbar;