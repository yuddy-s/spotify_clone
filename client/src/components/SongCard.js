import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';

import { Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from '@mui/material/Button';

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { song, index } = props;

    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    // submenu for playlists
    const [playlistMenuAnchor, setPlaylistMenuAnchor] = useState(null);
    const isPlaylistMenuOpen = Boolean(playlistMenuAnchor);

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

    // Menu actions ------------------------
    const handleAddToPlaylist = (playlistId) => {
        alert("Would add song to playlist: " + playlistId + " (TODO)");
        handlePlaylistMenuClose();
        handleMenuClose();
    };

    const handleEditSong = () => {
        store.showEditSongModal(index, song);
        handleMenuClose();
    };

    const handleRemoveFromCatalog = () => {
        store.addRemoveSongTransaction(song, index);
        handleMenuClose();
    };
    // -------------------------------------


    function handleDragStart(event) {
        event.dataTransfer.setData("song", index);
    }
    function handleDragOver(event) { event.preventDefault(); }
    function handleDragEnter(event) { event.preventDefault(); }
    function handleDragLeave(event) { event.preventDefault(); }
    function handleDrop(event) {
        event.preventDefault();
        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));

        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }

    // DOUBLE CLICK → EDIT
    function handleClick(event) {
        if (event.detail === 2) {
            store.showEditSongModal(index, song);
        }
    }

    let cardClass = "list-card unselected-list-card";

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
            onClick={handleClick}
            style={{ position: "relative" }}
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}>
                {song.title} ({song.year}) by {song.artist}
            </a>

            {/* 3 dot menu button */}
            <IconButton
                onClick={handleMenuOpen}
                sx={{ position: "absolute", right: "10px", top: "10px" }}
            >
                <MoreVertIcon />
            </IconButton>

            {/* Main menu */}
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

            {/* Playlist sub menu */}
            <Menu
                anchorEl={playlistMenuAnchor}
                open={isPlaylistMenuOpen}
                onClose={handlePlaylistMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                {/* Hard coded testing playlists */}
                <MenuItem onClick={() => handleAddToPlaylist("playlist1")}>My Playlist 1</MenuItem>
                <MenuItem onClick={() => handleAddToPlaylist("playlist2")}>Chill Vibes</MenuItem>
                <MenuItem onClick={() => handleAddToPlaylist("playlist3")}>Workout Mix</MenuItem>
            </Menu>
        </div>
    );
}

export default SongCard;
