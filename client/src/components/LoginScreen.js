import { useContext, useState } from 'react';
import AuthContext from '../auth';
import MUIErrorModal from './MUIErrorModal';
import Copyright from './Copyright';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Close";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function LoginScreen() {
    const { auth } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        auth.loginUser(
            formData.get('email'),
            formData.get('password')
        );
    };

    const modalJSX = auth.errorMessage ? <MUIErrorModal /> : null;

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <LockOutlinedIcon sx={{ fontSize: 40, mb: 2 }} />

                <Typography component="h1" variant="h5" sx={{ color: '#424242', fontWeight: 30, mb: 2 }}>
                    Sign In
                </Typography>

                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="filled"
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            size="small"
                                            edge="end"
                                            sx={{ width: 15, height: 15, padding: 0, borderRadius: "50%", border: "1px solid black" }}
                                            onClick={() => setEmail("")}
                                        >
                                            <ClearIcon sx={{ fontSize: 12, color: 'black' }} />
                                        </IconButton>
                                    ),
                                }}
                                sx={{ backgroundColor: '#D3D3D3' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="filled"
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            size="small"
                                            edge="end"
                                            sx={{ width: 15, height: 15, padding: 0, borderRadius: "50%", border: "1px solid black" }}
                                            onClick={() => setPassword("")}
                                        >
                                            <ClearIcon sx={{ fontSize: 12, color: 'black' }} />
                                        </IconButton>
                                    ),
                                }}
                                sx={{ backgroundColor: '#D3D3D3' }}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, backgroundColor: '#424242' }}
                    >
                        Sign In
                    </Button>

                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/register/" variant="body2" sx={{ color: 'red', fontWeight: 'bold' }}>
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            <Copyright sx={{ mt: 5 }} />
            {modalJSX}
        </Container>
    );
}
