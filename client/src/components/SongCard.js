import { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';

import { Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import MUIDeleteSongModal from './MUIDeleteSongModal'; // import the modal
import MUIEditSongModal from './MUIEditSongModal';


function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { song, index } = props;

    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const [playlistMenuAnchor, setPlaylistMenuAnchor] = useState(null);
    const isPlaylistMenuOpen = Boolean(playlistMenuAnchor);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [userPlaylists, setUserPlaylists] = useState([]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            if (!store || !store.loadMyPlaylists) return;
            const playlists = await store.loadMyPlaylists();
            setUserPlaylists(playlists || []);
        };
        fetchPlaylists();
    }, []); 

    const handleMenuOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handlePlaylistMenuOpen = (event) => {
        event.stopPropagation();
        setPlaylistMenuAnchor(event.currentTarget);
    };

    const handlePlaylistMenuClose = () => {
        setPlaylistMenuAnchor(null);
    };

    const handleAddToPlaylist = async (playlistId) => {
        try {
            await store.addSongToPlaylist(song._id, playlistId);
            alert(`Added "${song.title}" to playlist!`);
        } catch (err) {
            console.error("Failed to add song to playlist:", err);
            alert("Failed to add song to playlist");
        } finally {
            handlePlaylistMenuClose();
            handleMenuClose();
        }
    };

    const handleEditSong = () => {
        setShowEditModal(true);
        handleMenuClose();
    };

 
    const handleRemoveFromCatalog = () => {
        setShowDeleteModal(true);
        handleMenuClose();
    };

 
    const handleConfirmDelete = async () => {
        await store.deleteSong(song._id, index);  
        setShowDeleteModal(false);
    };

    const handleConfirmEdit = async (updatedSong) => {
        await store.editSong(updatedSong, index); 
        setShowEditModal(false);
    };

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className="song-card"
            style={{
                backgroundColor: store.currentSongIndex === index ? "#f6b749ff" : "#FFE66D",
                border: "2px solid black",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "10px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
            }}
        >
            <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                {index + 1}. {song.title} ({song.year})
            </div>

            <div style={{ fontSize: "14px" }}>
                by {song.artist}
            </div>

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "8px",
                fontSize: "13px",
                opacity: 0.85
            }}>
                <div> {song.listens} listens</div>
                <div>{song.playlists.length} playlists</div>
            </div>

            <IconButton
                onClick={handleMenuOpen}
                sx={{ position: "absolute", right: "10px", top: "10px" }}
            >
                <MoreVertIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem onClick={handlePlaylistMenuOpen}>Add to Playlist</MenuItem>
                <MenuItem onClick={handleEditSong}>Edit Song</MenuItem>
                <MenuItem onClick={handleRemoveFromCatalog}>Remove from Catalog</MenuItem>
            </Menu>

            {/* Playlist submenu */}
            <Menu
                anchorEl={playlistMenuAnchor}
                open={isPlaylistMenuOpen}
                onClose={handlePlaylistMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                {userPlaylists.length > 0 ? (
                    userPlaylists.map(p => (
                        <MenuItem key={p._id} onClick={() => handleAddToPlaylist(p._id)}>
                            {p.name}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>No playlists found</MenuItem>
                )}
            </Menu>

            {showDeleteModal && (
                <MUIDeleteSongModal
                    song={song}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleConfirmDelete}
                />
            )}
            {showEditModal && (
                <MUIEditSongModal
                    song={song}
                    onClose={() => setShowEditModal(false)}
                    onConfirm={handleConfirmEdit}
                />
            )}
        </div>
    );
}

export default SongCard;
