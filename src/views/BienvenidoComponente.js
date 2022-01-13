import { Container, makeStyles, Grid, Card, CardContent, Box, Typography } from '@material-ui/core';

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

export default function BienvenidoComponente() {
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="md">
            <div className={classes.paper}>
                <Grid className={classes.cardGrid} container spacing={2}>
                    <Box mt={2}>
                        <Card className={classes.card} variant="outlined">
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid className={classes.gridTitle} item xs={12}>
                                        <Typography variant="h5" className={classes.boldFont} gutterBottom>
                                            Bienvenido a sistema de agendamiento de horas
                                        </Typography>
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
