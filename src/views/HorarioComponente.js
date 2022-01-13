import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, makeStyles, Select, InputLabel, MenuItem, FormControl, Grid, Box, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const vigencia = require('../Vigencia');

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    gridButton: {
        textAlign: 'center'
    },
    button: {
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    }
}));

const hoy = new Date();

export default function HorarioComponent() {
    const navigate = useNavigate();

    const location = useLocation();

    const apiUrl = "http://localhost:4000/api";
    const apiUrlEspecialista = "/especialista";
    const apiUrlDisponibilidad = "/disponibilidad";

    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);

    const [especialistas, setEspecialistas] = useState([]);
    const [especialista, setEspecialista] = useState("");

    const [checkBoxes, setCheckBoxes] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    const [formDisabled, setFormDisabled] = useState(true);

    const classes = useStyles();

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleChange = (event) => {
        setEspecialista(event.target.value);
    };

    const handleDateChange = (date) => {
        setDate(date);
    };

    const handleCheckChange = index => event => {
        let newCheckBoxes = [...checkBoxes];
        newCheckBoxes[index] = {
            id: checkBoxes[index].id,
            horario: checkBoxes[index].horario,
            checked: event.target.checked
        };
        setCheckBoxes(newCheckBoxes);
    };

    const handleCheckAllChange = event => {
        let newCheckBoxes = [...checkBoxes];
        for (let i = 0; i < newCheckBoxes.length; i++) {
            newCheckBoxes[i].checked = !checkAll;
        }
        setCheckBoxes(newCheckBoxes);
        setCheckAll(!checkAll);
    };

    useEffect(() => {
        let checked = 0;
        for (let i = 0; i < checkBoxes.length; i++) {
            if (checkBoxes[i].checked) {
                checked++;
            }
        }
        if (checked === checkBoxes.length) {
            setCheckAll(true);
        }
        else {
            setCheckAll(false);
        }
    }, [checkBoxes]);

    useEffect(() => {
        if (especialista === "") {
            let newCheckBoxes = [...checkBoxes];
            for (let i = 0; i < newCheckBoxes.length; i++) {
                newCheckBoxes[i].disabled = true;
            }
            setCheckBoxes(newCheckBoxes);
            setFormDisabled(true);
        }
        else {
            let newCheckBoxes = [...checkBoxes];
            for (let i = 0; i < newCheckBoxes.length; i++) {
                newCheckBoxes[i].disabled = false;
            }
            setCheckBoxes(newCheckBoxes);
            setFormDisabled(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [especialista]);

    async function getEspecialistas() {
        try {
            const response = await axios.get(apiUrl + apiUrlEspecialista);
            if (response.status === 200) {
                setEspecialistas(response.data.especialistas);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        let newChecked = [];
        for (let i = 8; i <= 21; i++) {
            for (let j = 0; j <= 45; j = j + 15) {
                let hora = i.toString();
                let minuto = j.toString();
                if (hora.length === 1) {
                    hora = "0" + hora;
                }
                if (minuto.length === 1) {
                    minuto = minuto + "0";
                }
                newChecked.push({
                    id: hora + ":" + minuto,
                    horario: hora + ":" + minuto,
                    checked: false
                });
            }
        }
        setCheckBoxes(newChecked);
    }, []);

    useEffect(() => {
        getEspecialistas();
        vigencia.check(axios, location, navigate);
    }, [location, navigate]);

    function guardar() {
        const token = localStorage.getItem('TOKEN_PROYECTO');

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        
        let disponibilidades = [];
        for (let i = 0; i < checkBoxes.length; i++) {
            if (checkBoxes[i].checked) {
                disponibilidades.push({
                    especialista: especialista,
                    fecha: new Date(date.toDateString()),
                    horario: checkBoxes[i].horario
                });
            }
        }
        axios.post(apiUrl + apiUrlDisponibilidad,
            {
                disponibilidades: disponibilidades
            },
            config
        )
        .then(function (response) {
            if (response.status === 200) {
                MySwal.fire({
                    title: <p>Guardados!</p>,
                    text: 'Los horarios fueron guardados!',
                    icon: 'success'
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

    return (
        <Container component="main" maxWidth="md">
            <div className={classes.paper}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <Box mt={2}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Especialista</InputLabel>
                                        <Select
                                            open={open}
                                            label="Especialista"
                                            onClose={handleClose}
                                            onOpen={handleOpen}
                                            value={especialista}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value=""></MenuItem>
                                            {especialistas.map((especialista) => (
                                                <MenuItem key={especialista._id} value={especialista._id}>{especialista.nombre}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Box mt={2}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            fullWidth
                                            key="datePicker"
                                            disableToolbar
                                            minDate={hoy}
                                            disabled={formDisabled}
                                            variant="inline"
                                            format="dd/MM/yyyy"
                                            margin="normal"
                                            label="Fecha"
                                            value={date}
                                            onChange={handleDateChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'cambiar fecha',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            key="checkAll"
                                            checked={checkAll}
                                            disabled={formDisabled}
                                            onChange={handleCheckAllChange}
                                            color="primary"
                                        />
                                    }
                                    label="Habilitar todos"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Box ml={10} mt={1}>
                            <Grid container spacing={1}>
                                {checkBoxes.map(function(checkBox, index) {
                                    let newLine = (<br key={checkBox.id + "newLine"} />);
                                    if (index % 4 || index === 0) {
                                        newLine = "";
                                    }
                                    return [
                                        newLine,
                                        <Grid key={checkBox.id} item xs={12} md={3}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={checkBox.checked}
                                                        disabled={formDisabled}
                                                        onChange={handleCheckChange(index)}
                                                        color="primary"
                                                    />
                                                }
                                                label={checkBox.horario}
                                            />
                                        </Grid>
                                    ];
                                })}
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={12} className={classes.gridButton}>
                        <Box mt={2}>
                            <Button className={classes.button} variant="contained" color="primary" disabled={formDisabled} onClick={guardar}>Guardar</Button>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
}
