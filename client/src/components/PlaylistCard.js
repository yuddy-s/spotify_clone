import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';
import storeRequestSender from "../store/requests";

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';

import PlayPlaylistModal from './PlayPlaylistModal';
import MUIDeleteModal from './MUIDeleteModal';
import EditPlaylistModal from './EditPlaylistModal';


function PlaylistCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { idNamePair } = props;

    const [fullPlaylist, setFullPlaylist] = useState(null);

    // Modal states
    const [isPlayModalOpen, setIsPlayModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

   
    const handlePlayClick = async (event) => {
        event.stopPropagation();
        try {
            const response = await storeRequestSender.getPlaylistById(idNamePair._id);
            if (!response || !response.data.playlist) throw new Error("Failed to fetch playlist");

            setFullPlaylist(response.data.playlist);
            setIsPlayModalOpen(true);
            store.incrementPlaylistPlays(idNamePair._id);
        } catch (err) {
            console.error("Error fetching playlist:", err);
        }
    };

    // Handle Delete Modal
    const handleDeleteClick = (event) => {
        event.stopPropagation();
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        await store.deleteList(idNamePair._id); // directly delete
        setIsDeleteModalOpen(false);
    };

    const handleCopyClick = async (event) => {
        event.stopPropagation();
        try {
            let copyIndex = 0;
            let newName = idNamePair.name + " (copy)";

            // Get all playlists for checking duplicates
            const response = await storeRequestSender.getAllPlaylists();
            const allPlaylists = response.data.playlists || [];

            while (allPlaylists.some(p => p.ownerId._id === store.user._id && p.name === newName)) {
                copyIndex++;
                newName = idNamePair.name + ` (copy ${copyIndex})`;
            }

            // Create a new playlist with the same songs
            const createResponse = await storeRequestSender.createPlaylist(newName, idNamePair.songs || []);
            if (createResponse.status === 201 && createResponse.data.success) {
                // Refresh playlist list
                store.loadIdNamePairs();
            } else {
                console.error("Failed to copy playlist");
            }
        } catch (err) {
            console.error("Error copying playlist:", err);
        }
    };

    const handleEditClick = async (event) => {
        event.stopPropagation();
        try {
            const response = await storeRequestSender.getPlaylistById(idNamePair._id);
            if (!response.data.playlist) throw new Error('Failed to fetch playlist');

            store.currentList = response.data.playlist;

       
            setIsEditModalOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <ListItem
                id={idNamePair._id}
                key={idNamePair._id}
                button
                sx={{
                    borderRadius: "25px",
                    p: "10px",
                    bgcolor: 'white',
                    marginTop: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: props.selected ? '0 0 5px 2px #6750A4' : '0 0 3px 1px #ccc',
                    transition: 'background-color 0.25s',
                    '&:hover': { backgroundColor: '#e0e0e0' }
                }}
                style={{ transform: "translate(1%,0%)", width: '98%', fontSize: '13pt' }}
            >
                {/* Avatar */}
                <img 
                    src={idNamePair.ownerAvatar || '/default-avatar.png'} 
                    alt="avatar"
                    style={{ width: 50, height: 50, borderRadius: '50%', marginRight: '15px' }}
                />

                {/* Playlist info */}
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#1D1B20', fontWeight: 'bold', fontSize: '16px' }}>
                        {idNamePair.name}
                    </span>
                    <span style={{ color: '#1D1B20', fontSize: '14px' }}>
                        {idNamePair.ownerName}
                    </span>
                    <span style={{ color: '#2F80ED', fontSize: '14px' }}>
                        {idNamePair.listens} listeners
                    </span>
                </Box>

                {/* Buttons */}
                <button
                    style={{ backgroundColor: "#D2292F", color: "white", padding: '10px 10px', borderRadius: "10px", marginLeft: "20px", border: '1px solid black', transition: "ease 0.25s" }}
                    onClick={handleDeleteClick}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = "#fff"; e.target.style.color = "#000"; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = "#D2292F"; e.target.style.color = "#fff"; }}
                >
                    Delete
                </button>

                <button 
                    style={{ backgroundColor: "#3A64C4", color: "white", padding: '10px 10px', borderRadius: "10px", marginLeft: "10px", border: '1px solid black', transition: "ease 0.25s" }}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = "#fff"; e.target.style.color = "#000"; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = "#3A64C4"; e.target.style.color = "#fff"; }}
                    onClick={handleEditClick}
                >
                    Edit
                </button>

                <button 
                    style={{ backgroundColor: "#077836", color: "white", padding: '10px 10px', borderRadius: "10px", marginLeft: "10px", border: '1px solid black', transition: "ease 0.25s" }}
                    onClick={handleCopyClick}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = "#fff"; e.target.style.color = "#000"; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = "#077836"; e.target.style.color = "#fff"; }}
                >
                    Copy
                </button>

                <button 
                    style={{ backgroundColor: "#DE24BC", color: "white", padding: '10px 10px', borderRadius: "10px", marginLeft: "10px", border: '1px solid black', transition: "ease 0.25s" }}
                    onClick={handlePlayClick}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = "#fff"; e.target.style.color = "#000"; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = "#DE24BC"; e.target.style.color = "#fff"; }}
                >
                    Play
                </button>
            </ListItem>

            {/* Play Playlist Modal */}
            {isPlayModalOpen && fullPlaylist && (
                <PlayPlaylistModal
                    playlist={fullPlaylist}
                    onClose={() => {
                        setIsPlayModalOpen(false);
                        setFullPlaylist(null);
                        store.loadIdNamePairs();
                    }}
                />
            )}

            {/* Delete Playlist Modal */}
            {isDeleteModalOpen && (
                <MUIDeleteModal
                    playlist={idNamePair}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                />
            )}

            {isEditModalOpen && (
                <EditPlaylistModal
                    open={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        store.currentList = null; // clear current list in store
                        store.loadIdNamePairs();   // refresh playlists
                    }}
                />
            )}
        </>
    );
}

export default PlaylistCard;
