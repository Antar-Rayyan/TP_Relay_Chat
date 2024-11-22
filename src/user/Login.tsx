import { useState } from "react";
import { loginUser } from "./loginApi";
import { Session } from "../model/common";
import { CustomError } from "../model/CustomError";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../pages/NavBar";

export function Login() {
  const [error, setError] = useState({} as CustomError);
  const [session, setSession] = useState({} as Session);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    loginUser(
      {
        user_id: -1,
        username: data.get("login") as string,
        password: data.get("password") as string,
      },
      (result: Session) => {
        console.log(result);
        setSession(result);
        console.log(result.id);
        const userId = result.id?.toString() || "";
        sessionStorage.setItem("userId", userId);
        form.reset();
        navigate("/Messaging");

        window.Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            // OK
          }
        });

        setError(new CustomError(""));
      },
      (loginError: CustomError) => {
        console.log(loginError);
        setError(loginError);
        setSession({} as Session);
      }
    );
  };

  const handleLogout = () => {
    setSession({} as Session);
    sessionStorage.clear();
  };

  return (
    <>
      <NavBar />

      {/* Formulaire de connexion */}
      <Container maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Connexion
          </Typography>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Se connecter
            </Button>
          </form>

          {session.token && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body1">
                {session.username} : {session.token}
              </Typography>
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
