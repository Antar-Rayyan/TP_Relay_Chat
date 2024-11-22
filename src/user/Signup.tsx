import { useState } from "react";
import { TextField, Button, Container, Box, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavBar from "../pages/NavBar";

export function Signup() {
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);

        const username = data.get("login") as string;
        const email = data.get("email") as string;
        const password = data.get("password") as string;

        // Validation des champs
        if (!username || !email || !password) {
            setError("Tous les champs doivent être remplis.");
            return;
        }

        try {
            // Appel à l'API pour enregistrer l'utilisateur
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                const result = await response.json();
                setSuccess("Inscription réussie !");
                form.reset();
                setError("");
                navigate("/Login");
            } else {
                const error = await response.json();
                setError(error.message);
            }
        } catch (err) {
            setError("Erreur lors de l'enregistrement.");
        }
    };

    return (
        <>
        <NavBar/>

<Container maxWidth="xs">
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 5 }}>
        <Typography variant="h5" gutterBottom>Inscription</Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
                label="Nom d'utilisateur"
                name="login"
                variant="outlined"
                fullWidth
                margin="normal"
            />
            <TextField
                label="Email"
                name="email"
                type="email"
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
                S&apos;inscrire
            </Button>
        </form>

        {success && (
            <Box sx={{ mt: 3 }}>
                <Alert severity="success">{success}</Alert>
            </Box>
        )}

        {error && (
            <Box sx={{ mt: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        )}
    </Box>
</Container>
        </>
    );
}
