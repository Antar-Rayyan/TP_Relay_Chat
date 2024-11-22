import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

interface NavBarProps {
    handleLogout?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ handleLogout }) => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    const isSignupPage = location.pathname === '/signup';

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Mon Application
                </Typography>
                {handleLogout ? (
                    <Button color="inherit" onClick={handleLogout}>
                        Déconnexion
                    </Button>
                ) : (
                    <>
                        {isLoginPage ? (
                            <Button color="inherit" component={Link} to="/signup">
                                S&apos;inscrire
                            </Button>
                        ) : isSignupPage ? (
                            <Button color="inherit" component={Link} to="/login">
                                Se connecter
                            </Button>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/login">
                                    Se connecter
                                </Button>
                                <Button color="inherit" component={Link} to="/signup">
                                    S&apos;inscrire
                                </Button>
                            </>
                        )}
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
