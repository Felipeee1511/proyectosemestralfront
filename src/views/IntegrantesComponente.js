import React from 'react';
import { Container, List, ListItem, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    listItem: {
        alignItems: 'center',
        justifyContent: 'center'
        
    },
    boldFont: {
        fontWeight: 'bold'
    }
}));

export default function IntegrantesComponent() {
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="md">
            <div className={classes.paper}>
                <List>
                    <ListItem className={classes.listItem}>
                        <Typography variant="h3" className={classes.boldFont} gutterBottom>
                            Felipe Cartes
                        </Typography>
                    </ListItem>
                    
                </List>
            </div>
        </Container>
    );
}
