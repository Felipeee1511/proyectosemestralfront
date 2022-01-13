import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, makeStyles, Grid, Button, Card, CardContent, Box, Typography } from '@material-ui/core';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Rut = require('../../Rut');

const MySwal = withReactContent(Swal);

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
    gridTitle: {
        textAlign: 'center'
    },
    gridButton: {
        textAlign: 'right'
    }
}));

export default function AgendarConfirmarComponent() {
    const {state} = useLocation();
    const navigate = useNavigate();

    const apiUrl = "http://localhost:4000/api";
    const apiUrlDisponibilidad = "/disponibilidad";
    const apiUrlCita = "/cita";

    const [rut, setRut] = useState("");
    const [disponibilidad, setDisponibilidad] = useState("");
    const [disponibilidadInfo, setDisponibilidadInfo] = useState(
        {
            "especialista":
                {
                    "nombre":"",
                    "especialidad":
                        {
                            "descripcion":"",
                        }
                },
            "fecha": "",
            "horario":""
        }
    );

    useEffect(() => {
        if (state == null) {
            navigate('/agendar', { replace: true });
            return;
        }

        const {
            rut,
            disponibilidad
        } = state;

        console.log(state);

        setRut(rut);
        setDisponibilidad(disponibilidad);
    }, [state, navigate]);

    useEffect(() => {
        async function getDisponibilidad() {
            try {
                if (disponibilidad !== "") {
                    const response = await axios.get(apiUrl + apiUrlDisponibilidad + "/" + disponibilidad);
                    if (response.status === 200) {
                        response.data.disponibilidad.fecha = new Date(response.data.disponibilidad.fecha).toLocaleDateString("es-CL",
                            {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric' 
                            }
                        );

                        response.data.disponibilidad.horario = response.data.disponibilidad.horario + " horas"
                        setDisponibilidadInfo(response.data.disponibilidad);
                    }
                }
            }
            catch (error) {
                console.error(error);
            }
        }

        getDisponibilidad();
    }, [disponibilidad]);

    function confirmar() {
        if (!Rut.validar(rut)) {
            MySwal.fire({
                title: <p>Error!</p>,
                text: "El RUT ingresado no es valido!",
                icon: 'error'
            });
        }
        else {
            cambiarDisponibilidad();
        }
    }

    function cambiarDisponibilidad() {
        axios.put(apiUrl + apiUrlDisponibilidad + '/' + disponibilidad,
            {
                disponible: false
            }
        )
        .then(function (response) {
            if (response.status === 200) {
                guardarCita();
            }
            else {
                MySwal.fire({
                    title: <p>Error!</p>,
                    text: response.data.mensaje,
                    icon: 'error'
                });
            }
        })
        .catch(function (error) {
            MySwal.fire({
                title: <p>Error!</p>,
                text: error.response.data.mensaje,
                icon: 'error'
            });
        });
    }

    function guardarCita() {
        axios.post(apiUrl + apiUrlCita,
            {
                rut: rut,
                disponibilidad: disponibilidad
            }
        )
        .then(function (response) {
            if (response.status === 200) {
                MySwal.fire({
                    title: <p>Confirmada!</p>,
                    text: 'La cita fue confirmada!',
                    icon: 'success',
                    confirmButtonText: 'Cerrar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/bienvenido', { replace: true });
                    }
                });
            }
            else {
                MySwal.fire({
                    title: <p>Error!</p>,
                    text: response.data.mensaje,
                    icon: 'error'
                });
            }
        })
        .catch(function (error) {
            MySwal.fire({
                title: <p>Error!</p>,
                text: error.response.data.mensaje,
                icon: 'error'
            });
        });
    }

    const classes = useStyles();

    return (
        <Container component="main" maxWidth="sm">
            <div className={classes.paper}>
                <Grid className={classes.cardGrid} container spacing={2}>
                    <Box key={disponibilidad._id} mt={2}>
                        <Card className={classes.card} variant="outlined">
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid className={classes.gridTitle} item xs={12}>
                                        <Typography variant="h4" className={classes.boldFont} gutterBottom>
                                            Confirmación
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {disponibilidadInfo.fecha} {disponibilidadInfo.horario}
                                    </Grid>
                                    <Grid item xs={12}>
                                        {disponibilidadInfo.especialista.especialidad.descripcion}
                                    </Grid>
                                    <Grid item xs={12}>
                                        {disponibilidadInfo.especialista.nombre}
                                    </Grid>
                                    <Grid className={classes.gridButton} item xs={12}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={confirmar}
                                        >
                                            Confirmar
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </div>
        </Container>
    );
}
