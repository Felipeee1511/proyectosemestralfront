import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, makeStyles, Select, InputLabel, MenuItem, FormControl, Grid, Box, Button, TextField } from '@material-ui/core';
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
    gridButton: {
        textAlign: 'center'
    },
    button: {
        [theme.breakpoints.down('xs')]: {
            width: '100%'
        }
    }
}));

export default function AgendarComponent() {
    const navigate = useNavigate();

    const apiUrl = "http://localhost:4000/api";
    const apiUrlEspecialidad = "/especialidad";
    const apiUrlEspecialista = "/especialista";

    const [especialidadOpen, setEspecialidadOpen] = useState(false);
    const [especialistaOpen, setEspecialistaOpen] = useState(false);

    const [rut, setRut] = useState("");

    const [especialidades, setEspecialidades] = useState([]);
    const [especialidad, setEspecialidad] = useState("");

    const [especialistas, setEspecialistas] = useState([]);
    const [especialista, setEspecialista] = useState("");
    const [especialistaDisabled, setEspecialistaDisabled] = useState(true);

    const [formDisabled, setFormDisabled] = useState(true);

    const handleEspecialidadClose = () => {
        setEspecialidadOpen(false);
    };

    const handleEspecialidadOpen = () => {
        setEspecialidadOpen(true);
    };

    const handleEspecialidadChange = (event) => {
        setEspecialidad(event.target.value);
    };

    const handleEspecialistaClose = () => {
        setEspecialistaOpen(false);
    };

    const handleEspecialistaOpen = () => {
        setEspecialistaOpen(true);
    };

    const handleEspecialistaChange = (event) => {
        setEspecialista(event.target.value);
    };

    const handleRutChange = (event) => {
        let value = Rut.limpiar(event.target.value);
        if (value.match(/[^0-9k]/ig)) {
            value = value.replace(value, '');
        }
        if (value.match(/^(\d{2})(\d{3}){2}(\w{1})$/)) {
            value = value.replace(/^(\d{2})(\d{3})(\d{3})(\w{1})$/, '$1.$2.$3-$4');
        }
        else if (value.match(/^(\d)(\d{3}){2}(\w{0,1})$/)) {
            value = value.replace(/^(\d)(\d{3})(\d{3})(\w{0,1})$/, '$1.$2.$3-$4');
        }
        else if (value.match(/^(\d)(\d{3})(\d{0,2})$/)) {
            value = value.replace(/^(\d)(\d{3})(\d{0,2})$/, '$1.$2.$3');
        }
        else if (value.match(/^(\d)(\d{0,2})$/)) {
            value = value.replace(/^(\d)(\d{0,2})$/, '$1.$2');
        }

        if (value.substr(value.length - 1, 1) === '-') {
            value = value.substr(0, value.length - 1);
        }

        if (value.substr(value.length - 1, 1) === '.') {
            value = value.substr(0, value.length - 1);
        }

        setRut(value);
    }

    async function getEspecialidades() {
        try {
            const response = await axios.get(apiUrl + apiUrlEspecialidad);
            if (response.status === 200) {
                setEspecialidades(response.data.especialidades);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    async function getEspecialistas(especialidad) {
        try {
            const response = await axios.get(apiUrl + apiUrlEspecialista +  apiUrlEspecialidad + "/" + especialidad);
            if (response.status === 200) {
                setEspecialistas(response.data.especialistas);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    function guardar() {
        if (!Rut.validar(rut)) {
            MySwal.fire({
                title: <p>Error!</p>,
                text: "El RUT ingresado no es valido!",
                icon: 'error'
            });
        }
        else {
            navigate('/agendar/horario',
                {
                    state: {
                        rut: rut,
                        especialista: especialista
                    } 
                }
            );
        }
    }

    useEffect(() => {
        if (especialidad === "") {
            setEspecialistaDisabled(true);
            setEspecialista("");
        }
        else {
            getEspecialistas(especialidad);
            setEspecialistaDisabled(false);
        }
    }, [especialidad]);

    useEffect(() => {
        if (especialista === "") {
            setFormDisabled(true);
        }
        else {
            setFormDisabled(false);
        }
    }, [especialista]);

    useEffect(() => {
        getEspecialidades();
    }, []);

    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            id="run"
                            label="RUT"
                            value={rut}
                            onChange={handleRutChange}
                            variant="outlined"
                            inputProps={{ maxLength: 12 }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box mt={2}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Especialidad</InputLabel>
                                <Select
                                    open={especialidadOpen}
                                    label="Especialidad"
                                    onClose={handleEspecialidadClose}
                                    onOpen={handleEspecialidadOpen}
                                    value={especialidad}
                                    onChange={handleEspecialidadChange}
                                >
                                    <MenuItem value=""></MenuItem>
                                    {especialidades.map((especialidad) => (
                                        <MenuItem key={especialidad._id} value={especialidad._id}>{especialidad.descripcion}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box mt={2}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Especialista</InputLabel>
                                <Select
                                    open={especialistaOpen}
                                    label="Especialista"
                                    onClose={handleEspecialistaClose}
                                    onOpen={handleEspecialistaOpen}
                                    value={especialista}
                                    onChange={handleEspecialistaChange}
                                    disabled={especialistaDisabled}
                                >
                                    <MenuItem value=""></MenuItem>
                                    {especialistas.map((especialista) => (
                                        <MenuItem key={especialista._id} value={especialista._id}>{especialista.nombre}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={12} className={classes.gridButton}>
                        <Box mt={2}>
                            <Button className={classes.button} variant="contained" color="primary" disabled={formDisabled} onClick={guardar}>Siguiente</Button>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
}
