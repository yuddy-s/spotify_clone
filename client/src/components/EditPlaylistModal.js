import { useContext, useEffect, useState } from 'react';
import { GlobalStoreContext } from '../store';
import CloseIcon from '@mui/icons-material/Close';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

import storeRequestSender from "../store/requests";

const YellowSongCard = ({ song, onDuplicate, onDelete }) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                borderRadius: '6px',
                backgroundColor: '#fff176', // Yellow
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
        >
            <div style={{ flexGrow: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{song.title}</div>
                <div style={{ fontSize: '0.9em', color: '#555' }}>
                    {song.artist} • {song.year}
                </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
                <button
                    onClick={onDuplicate}
                    style={{
                        backgroundColor: '#4caf50',
                        border: 'none',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Duplicate
                </button>
                <button
                    onClick={onDelete}
                    style={{
                        backgroundColor: '#f44336',
                        border: 'none',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

const EditPlaylistModal = ({ open, onClose }) => {
    const { store } = useContext(GlobalStoreContext);
    const [localSongs, setLocalSongs] = useState([]);
    const [playlistName, setPlaylistName] = useState('');
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [tpsInitialized, setTpsInitialized] = useState(false);

    useEffect(() => {
        if (open && store.currentList) {
            setPlaylistName(store.currentList.name);
            setLocalSongs([...store.currentList.songs]);

            if (!tpsInitialized) {
                // Clear TPS stack on first modal open
                if (store.tps && store.tps.clearAllTransactions) {
                    store.tps.clearAllTransactions();
                }
                setTpsInitialized(true);
            }
        }
    }, [open, store.currentList]);

    const handleNameChange = (e) => {
        setPlaylistName(e.target.value);
        if (store.currentList) store.currentList.name = e.target.value;
    };

    const handleDuplicateSong = (song, index) => {
        store.addCreateSongTransaction(index + 1, song.title, song.artist, song.year, song.youTubeId);
        const newSongs = [...localSongs];
        newSongs.splice(index + 1, 0, { ...song });
        setLocalSongs(newSongs);
    };

    const handleDeleteSong = (song, index) => {
        store.addRemoveSongTransaction(song, index);
        const newSongs = [...localSongs];
        newSongs.splice(index, 1);
        setLocalSongs(newSongs);
    };

    const handleDragStart = (index) => setDraggedIndex(index);

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newSongs = [...localSongs];
        const [movedSong] = newSongs.splice(draggedIndex, 1);
        newSongs.splice(index, 0, movedSong);
        setDraggedIndex(index);
        setLocalSongs(newSongs);
    };

    const handleDrop = (startIndex, endIndex) => {
        if (startIndex !== endIndex) {
            store.addMoveSongTransaction(startIndex, endIndex);
        }
        setDraggedIndex(null);
    };

    const handleUndo = () => {
        if (store.canUndo()) {
            store.undo();
            setLocalSongs([...store.currentList.songs]);
        }
    };

    const handleRedo = () => {
        if (store.canRedo()) {
            store.redo();
            setLocalSongs([...store.currentList.songs]);
        }
    };

    const handleSave = async () => {
        if (!store.currentList) return;

        try {
            // Prepare the updated playlist object
            const updatedPlaylist = {
                ...store.currentList,
                name: playlistName,
                songs: localSongs.map(song => song._id || song.id || song.id) // adjust depending on song object
            };

            // Send the PUT request to backend
            const response = await storeRequestSender.updatePlaylistById(store.currentList._id, updatedPlaylist);

            if (response.status === 200 && response.data.success) {
                // Update store's current list
                store.currentList = response.data.playlist;

                // Reload playlists if needed
                store.loadIdNamePairs();

                // Close modal
                onClose();
            } else {
                console.error("Failed to save playlist:", response.data.errorMessage);
            }
        } catch (err) {
            console.error("Error updating playlist:", err);
        }
    };

    if (!open || !store.currentList) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
            }}
        >
            <div
                style={{
                    backgroundColor: '#d0f0c0',
                    border: '4px solid #006400',
                    borderRadius: '12px',
                    width: '80%',
                    height: '80%', // larger fixed size
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0',
                    position: 'relative'
                }}
            >
                {/* Top green bar */}
                <div style={{
                    backgroundColor: "#0E8503",
                    color: "white",
                    padding: "10px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTopLeftRadius: "6px",
                    borderTopRightRadius: "6px"
                }}>
                    <h2 style={{ margin: 0 }}>Edit Playlist</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                        }}
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Playlist Name Input */}
                <div style={{ padding: '15px' }}>
                    <input
                        type="text"
                        value={playlistName}
                        onChange={handleNameChange}
                        style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid gray',
                            width: '95%',
                            backgroundColor: '#e0e0e0'
                        }}
                    />
                </div>

                {/* Songs container */}
                <div
                    style={{
                        backgroundColor: 'white',
                        flexGrow: 1,
                        overflowY: 'auto',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        margin: '0 15px'
                    }}
                >
                    {localSongs.map((song, index) => (
                        <div
                            key={index}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={() => handleDrop(draggedIndex, index)}
                        >
                            <YellowSongCard
                                song={song}
                                onDuplicate={() => handleDuplicateSong(song, index)}
                                onDelete={() => handleDeleteSong(song, index)}
                            />
                        </div>
                    ))}
                </div>

                {/* Footer buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px' }}>
                    <div>
                        <button
                            onClick={handleUndo}
                            disabled={!store.canUndo()}
                            style={{
                                marginRight: '10px',
                                padding: '8px 12px',
                                backgroundColor: '#800080',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: store.canUndo() ? 'pointer' : 'not-allowed'
                            }}
                        >
                            <UndoIcon />
                        </button>
                        <button
                            onClick={handleRedo}
                            disabled={!store.canRedo()}
                            style={{
                                padding: '8px 12px',
                                backgroundColor: '#800080',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: store.canRedo() ? 'pointer' : 'not-allowed'
                            }}
                        >
                            <RedoIcon />
                        </button>
                    </div>

                    <button
                        onClick={handleSave}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#006400',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPlaylistModal;
