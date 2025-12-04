import { useState, useContext } from 'react';
import AuthContext from '../auth'
import MUIErrorModal from './MUIErrorModal'
import Copyright from './Copyright'

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Close"; 

export default function RegisterScreen() {
    const { auth } = useContext(AuthContext);

    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");

    const isFormValid = () => {
        if (!userName || !email || !password || !passwordVerify || !avatar) return false;
        if (password.length < 8) return false;
        if (password !== passwordVerify) return false;
        return true;
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            window.alert('Avatar must be a JPG or PNG image.');
            return;
        }

        const reader = new FileReader();
        const img = new Image();
        reader.onload = (e) => {
            img.onload = () => {
                const size = 128;
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, size, size);
                const base64 = canvas.toDataURL(file.type);
                setAvatar(base64);
                setAvatarPreview(base64);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        auth.registerUser(
            formData.get('userName'),
            formData.get('email'),
            formData.get('password'),
            formData.get('passwordVerify'),
            avatar
        );
    };

    const modalJSX = auth.errorMessage ? <MUIErrorModal /> : null;

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <LockOutlinedIcon sx={{ fontSize: 40, mb: 2 }} />
                <Typography component="h1" variant="h5" sx={{ color: '#424242', fontWeight: 30 }}>
                    Create Account
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: -90,
                                        top: '70%',
                                        transform: 'translateY(-50%)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Avatar
                                        src={avatarPreview || undefined}
                                        sx={{ width: 56, height: 56 }}
                                    >
                                        ?
                                    </Avatar>
                                    <Button
                                        variant="text"
                                        component="label"
                                        sx={{ mt: 1, fontSize: 12, textTransform: 'none', padding: 0 }}
                                    >
                                        Change Avatar
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/png,image/jpeg"
                                            onChange={handleAvatarChange}
                                        />
                                    </Button>
                                </Box>

                                <TextField
                                    variant="filled"
                                    fullWidth
                                    name="userName"
                                    id="userName"
                                    label="User Name"
                                    sx={{ backgroundColor: '#D3D3D3' }}
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                size="small"
                                                edge="end"
                                                sx={{ width: 15, height: 15, padding: 0, borderRadius: "50%", border: "1px solid black" }}
                                                onClick={() => setUserName("")}
                                            >
                                                <ClearIcon sx={{ fontSize: 12, color: 'black' }} />
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="filled"
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                sx={{ backgroundColor: '#D3D3D3' }}
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
                                sx={{ backgroundColor: '#D3D3D3' }}
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
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="filled"
                                fullWidth
                                name="passwordVerify"
                                label="Confirm Password"
                                type="password"
                                id="passwordVerify"
                                sx={{ backgroundColor: '#D3D3D3' }}
                                value={passwordVerify}
                                onChange={(e) => setPasswordVerify(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            size="small"
                                            edge="end"
                                            sx={{ width: 15, height: 15, padding: 0, borderRadius: "50%", border: "1px solid black" }}
                                            onClick={() => setPasswordVerify("")}
                                        >
                                            <ClearIcon sx={{ fontSize: 12, color: 'black' }} />
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, backgroundColor: '#424242' }}
                        onClick={(event) => {
                            if (!isFormValid()) {
                                event.preventDefault(); 
                                return;
                            }
                        }}
                    >
                        Create Account
                    </Button>

                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login/" variant="body2" sx={{ color: 'red', fontWeight: 'bold' }}>
                                Already have an account? Sign in
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
