import { useContext } from 'react'
import HomeScreen from './PlaylistScreen'
import AuthContext from '../auth'
import { Link } from 'react-router-dom'


export default function WelcomeScreen() {
    const { auth } = useContext(AuthContext);
    console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);
    
    if (auth.loggedIn)
        return <HomeScreen />

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '75vh',
            gap: '20px'
        }}>
            <h1>THE PLAYLISTER</h1>
            <img src="/playlisterLogo.svg" alt="Playlister Logo" style={{ width: '200px', backgroundColor: 'transparent' }} />

            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <Link to="/playlists">
                    <button 
                        style={{ width: '175px', padding: '10px 20px' }}
                    >
                        Continue as Guest
                    </button>
                </Link>
                <Link to="/login">
                    <button style={{ width: '175px', padding: '10px 20px' }}>Login</button>
                </Link>
                <Link to="/register">
                    <button style={{ width: '175px', padding: '10px 20px' }}>Create Account</button>
                </Link>
            </div>
        </div>
    );
}