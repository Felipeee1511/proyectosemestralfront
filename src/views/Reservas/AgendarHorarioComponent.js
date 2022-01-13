import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, makeStyles, Grid, Button, Card, CardContent, Box, Typography } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    cardGrid: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    card: {
        [theme.breakpoints.up('md')]: {
            minWidth: 600
        }
    },
    gridButton: {
        textAlign: 'right'
    },
    gridTitle: {
        textAlign: 'center'
    },
    boldFont: {
        fontWeight: 'bold'
    }
}));

export default function AgendarHorarioComponent() {
    const {state} = useLocation();
    const navigate = useNavigate();

    const apiUrl = "http://localhost:4000/api";
    const apiUrlDisponibilidad = "/disponibilidad";
    const apiUrlEspecialista = "/especialista";

    const [rut, setRut] = useState("");
    const [especialista, setEspecialista] = useState("");

    const [disponibilidades, setDisponibilidades] = useState([]);

    useEffect(() => {
        if (state == null) {
            navigate('/agendar', { replace: true });
            return;
        }

        const {
            rut,
            especialista
        } = state;

        setRut(rut);
        setEspecialista(especialista);
    }, [state, navigate]);

    useEffect(() => {
        async function getDisponibilidades() {
            try {
                if (especialista !== "") {
                    const response = await axios.get(apiUrl + apiUrlDisponibilidad + apiUrlEspecialista + "/" + especialista);
                    if (response.status === 200) {
                        let newDisponibilidades = [...response.data.disponibilidades];
                        for (let i = newDisponibilidades.length - 1; i >= 0; i--) {
                            if (new Date(newDisponibilidades[i].fecha) < new Date().setHours(0, 0, 0, 0) || !newDisponibilidades[i].disponible) {
                                newDisponibilidades.splice(i, 1);
                            }
                        }
                        setDisponibilidades(newDisponibilidades);
                    }
                }
            }
            catch (error) {
                console.error(error);
            }
        }

        getDisponibilidades();
    }, [especialista]);

    function confirmar(id) {
        navigate('/agendar/confirmar',
            {
                state: {
                    rut: rut,
                    disponibilidad: id
                } 
            }
        );
    }

    const classes = useStyles();

    if (disponibilidades.length > 0) {
        return (
            <Container component="main" maxWidth="sm">
                <div className={classes.paper}>
                    <Grid className={classes.cardGrid} container spacing={2}>
                        {disponibilidades.map((disponibilidad) => (
                            <Box key={disponibilidad._id} mt={2}>
                                <Card className={classes.card} variant="outlined">
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={8}>
                                                {new Date(disponibilidad.fecha).toLocaleDateString("es-CL",
                                                    {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric' 
                                                    })} {disponibilidad.horario} horas
                                            </Grid>
                                            <Grid className={classes.gridButton} item xs={4}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => confirmar(disponibilidad._id)}
                                                >
                                                    Confirmar
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Grid>
                </div>
            </Container>
        );
    }
    else {
        return (
            <Container component="main" maxWidth="md">
                <div className={classes.paper}>
                    <Grid className={classes.cardGrid} container spacing={2}>
                        <Box mt={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h4" className={classes.boldFont} gutterBottom>
                                        La especialista elegida no tiene horarios disponibles.
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </div>
            </Container>
        );
    }
}
