import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'

import EditToolbar from './EditToolbar'

import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
    }

    const handleHouseClick = () => {
        store.closeCurrentList();
    }

    const handleEdit = () => {

    }

    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}><Link to='/login/'>Login</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></MenuItem>
        </Menu>
    );
    const loggedInMenu = 
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}><Link to='/editAccount/'>Edit Account</Link></MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>        

    let editToolbar = "";
    let menu = loggedOutMenu;
    if (auth.loggedIn) {
        menu = loggedInMenu;
        if (store.currentList) {
            editToolbar = "The Playlister";
        }
    }
    
    function getAccountMenu(loggedIn) {
        let userInitials = "js";
        console.log("userInitials: " + userInitials);
        if (loggedIn) 
            return <div>{userInitials}</div>;
        else
            return <AccountCircle />;
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static"
                sx={{
                    background: '#EE06FF'
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        <IconButton
                            onClick={handleHouseClick}
                            component={Link}
                            to="/"
                            size="large"
                            sx={{
                            color: "white",
                            "&:hover":{ backgroundColor:"rgba(255, 255, 255, 0.21)" }
                            }}
                        >
                            ⌂
                        </IconButton>
                    </Typography>
                    
                    <Link to="/playlists">
                        <button 
                            style={{ 
                                backgroundColor: "#000000", 
                                color: "white", 
                                padding: '10px 10px', 
                                borderRadius: "10px", 
                                marginLeft: "20px",
                                border: 'none',
                                transition: "ease 0.25s" 
                            }}
                            onMouseEnter={(e) => {e.target.style.backgroundColor = "#fff"; e.target.style.color = "#000000"}}
                            onMouseLeave={(e) => {e.target.style.backgroundColor = "#000000"; e.target.style.color = "#fff"}}
                        >
                            Playlists
                        </button>
                    </Link>
                    <Link to="/songs/">
                        <button 
                            style={{ 
                                backgroundColor: "#3A64C4", 
                                color: "white", 
                                padding: '10px 10px', 
                                borderRadius: "10px", 
                                marginLeft: "20px",
                                border: '1px solid black',
                                transition: "ease 0.25s" 
                            }}
                            onMouseEnter={(e) => {e.target.style.backgroundColor = "#fff"; e.target.style.color = "#000000"}}
                            onMouseLeave={(e) => {e.target.style.backgroundColor = "#3A64C4"; e.target.style.color = "#fff"}}
                        >
                            Song Catalog
                        </button>
                    </Link>

                    <Box sx={{ flexGrow: 1 }}>{editToolbar}</Box>
                    <Box sx={{ height: "90px", display: { xs: 'none', md: 'flex' }, padding: "10px 10px" }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            { getAccountMenu(auth.loggedIn) }
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {
                menu
            }
        </Box>
    );
}