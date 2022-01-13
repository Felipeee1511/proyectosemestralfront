import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const vigencia = require('../Vigencia');

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    }
}));

export default function SignInComponent () {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            await new Promise((r) => setTimeout(r, 1000));
            setLoading((loading) => !loading);
        };
        
        loadData();
    }, []);

    const location = useLocation();

    const { register, handleSubmit } = useForm();

    useEffect(() => {
        vigencia.check(axios, location, navigate);
    }, [location, navigate]);

    const onSubmit = data => {
        axios
        .post("http://localhost:4000/api/usuario/validar", {
            mail:data.email,
            pass:data.password
        })
        .then((response) => {
            if (response.data.mensaje === 'correcto') {
                localStorage.setItem('TOKEN_PROYECTO', response.data.token);
                navigate('/admin/horario', { replace: true });
                return;
            }
        })
        .catch((err) => {
            if (err.response) {
                if (err.response.status === 401) {
                    let motivo= err.response.data.mensaje;
                    alert(`No autorizado: ${motivo}`);
                }
            } 
            else if (err.request) {
                
            }
            else {
               
            }
        });
    };

    const classes = useStyles();

    if (loading) {
        return (
            <Container component="main" maxWidth="md">
                <div className={classes.paper}>
                    <div className="loader-container">
                        <div className="loader"></div>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">Sign in</Typography>

                <form onSubmit={handleSubmit(onSubmit)} className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        {...register('email', { required: true })}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        {...register('password', { required: true })}
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                
                </form>
            </div>
        </Container>
    );
}
