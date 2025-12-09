import { useState, useEffect } from 'react';

export default function MUIEditSongModal({ song, index, onClose, onConfirm }) {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [year, setYear] = useState('');
    const [youTubeId, setYouTubeId] = useState('');

    // Autofill modal fields when opened
    useEffect(() => {
        if (song) {
            setTitle(song.title || '');
            setArtist(song.artist || '');
            setYear(song.year ? song.year.toString() : '');
            setYouTubeId(song.youTubeId || ''); // <-- autofill YouTube ID
        }
    }, [song]);

    const handleConfirm = () => {
        onConfirm({
            ...song,
            title: title.trim(),
            artist: artist.trim(),
            year: parseInt(year) || song.year,
            youTubeId: youTubeId.trim()
        }, index);
        onClose();
    };

    return (
        <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            maxWidth: "500px",
            backgroundColor: "#B0FFB5",
            border: "4px solid #0E8503",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}>
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
                <h2 style={{ margin: 0 }}>Edit Song</h2>
            </div>

            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <input
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{ padding: "8px", backgroundColor: "#ccc", borderRadius: "6px", border: "none" }}
                />
                <input
                    placeholder="Artist"
                    value={artist}
                    onChange={e => setArtist(e.target.value)}
                    style={{ padding: "8px", backgroundColor: "#ccc", borderRadius: "6px", border: "none" }}
                />
                <input
                    placeholder="Year"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    style={{ padding: "8px", backgroundColor: "#ccc", borderRadius: "6px", border: "none" }}
                />
                <input
                    placeholder="YouTube ID"
                    value={youTubeId}
                    onChange={e => setYouTubeId(e.target.value)}
                    style={{ padding: "8px", backgroundColor: "#ccc", borderRadius: "6px", border: "none" }}
                />
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px" }}>
                <button
                    onClick={handleConfirm}
                    style={{
                        backgroundColor: "black",
                        color: "white",
                        padding: "12px 25px",
                        borderRadius: "12px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    Confirm
                </button>
                <button
                    onClick={onClose}
                    style={{
                        backgroundColor: "black",
                        color: "white",
                        padding: "12px 25px",
                        borderRadius: "12px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
