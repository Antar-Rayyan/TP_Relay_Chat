import { useState } from "react";
import { loginUser } from "./loginApi";
import { Session } from "../model/common";
import { CustomError } from "../model/CustomError";
import { TextField, Button, Container, Typography, Box, Alert, AppBar, Toolbar, IconButton } from '@mui/material';
import { Link } from 'react-router-dom'; // pour gérer les liens de navigation

export function Login() {
    const [error, setError] = useState({} as CustomError);
    const [session, setSession] = useState({} as Session);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        loginUser({ user_id: -1, username: data.get('login') as string, password: data.get('password') as string },
            (result: Session) => {
                console.log(result);
                setSession(result);
                form.reset();
                setError(new CustomError(""));
            }, (loginError: CustomError) => {
                console.log(loginError);
                setError(loginError);
                setSession({} as Session);
            });
    };

    const handleLogout = () => {
        setSession({} as Session); // réinitialise la session à vide
        sessionStorage.clear(); // supprime les données de session
    };

    return (
        <>
            {/* Barre de navigation */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Mon Application
                    </Typography>
                    {!session.token ? (
                        <Button color="inherit" component={Link} to="/signup">
                            S&apos;inscrire
                        </Button>
                    ) : (
                        <Button color="inherit" onClick={handleLogout}>
                            Déconnexion
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            {/* Formulaire de connexion */}
            <Container maxWidth="xs">
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                    <Typography variant="h5" gutterBottom>Connexion</Typography>

                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <TextField
                            label="Nom d'utilisateur"
                            name="login"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Mot de passe"
                            name="password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Se connecter
                        </Button>
                    </form>

                    {session.token && (
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body1">{session.username} : {session.token}</Typography>
                        </Box>
                    )}

                    {error.message && (
                        <Box sx={{ mt: 2 }}>
                            <Alert severity="error">{error.message}</Alert>
                        </Box>
                    )}
                </Box>
            </Container>
        </>
    );
}
