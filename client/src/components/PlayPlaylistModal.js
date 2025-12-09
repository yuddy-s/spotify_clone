import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

export default function PlayPlaylistModal({ playlist, onClose }) {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [repeat, setRepeat] = useState(false);

    const playerRef = useRef(null);
    const currentSong = playlist.songs[currentSongIndex];

    // load YouTube API
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
            window.onYouTubeIframeAPIReady = initializePlayer;
        } else {
            initializePlayer();
        }

        // Cleanup
        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [currentSong]);

    // init YouTube player
    const initializePlayer = () => {
        if (!currentSong) return;

        if (playerRef.current) {
            playerRef.current.loadVideoById(currentSong.youTubeId);
            if (isPlaying) playerRef.current.playVideo();
        } else {
            playerRef.current = new window.YT.Player("yt-player", {
                videoId: currentSong.youTubeId,
                events: {
                    onReady: (event) => {
                        if (isPlaying) event.target.playVideo();
                    },
                    onStateChange: (event) => {
                        if (event.data === window.YT.PlayerState.ENDED) handleNextAuto();
                    },
                },
            });
        }
    };

    // auto next or loop
    const handleNextAuto = () => {
        if (currentSongIndex < playlist.songs.length - 1) {
            setCurrentSongIndex(currentSongIndex + 1);
            setIsPlaying(true);
        } else if (repeat) {
            setCurrentSongIndex(0);
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    };

    const handlePrev = () => {
        if (currentSongIndex > 0) setCurrentSongIndex(currentSongIndex - 1);
        else if (repeat) setCurrentSongIndex(playlist.songs.length - 1);
    };

    const handleNext = () => {
        if (currentSongIndex < playlist.songs.length - 1) setCurrentSongIndex(currentSongIndex + 1);
        else if (repeat) setCurrentSongIndex(0);
    };

    const handleSongClick = (index) => {
        setCurrentSongIndex(index);
        setIsPlaying(true);
    };

    const togglePlayPause = () => {
        if (!playerRef.current) return;
        if (isPlaying) playerRef.current.pauseVideo();
        else playerRef.current.playVideo();
        setIsPlaying(!isPlaying);
    };

    const toggleRepeat = () => setRepeat(!repeat);

    return (
        <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#B0FFB5",
            border: "4px solid #0E8503",
            borderRadius: "10px",
            width: "80%",
            height: "80%",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000
        }}>
            {/* Top row */}
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
                <h2 style={{ margin: 0 }}>Play Playlist</h2>
            </div>

          
            <div style={{ display: "flex", flex: 1, padding: "20px", gap: "20px" }}>
                
                <div style={{ flex: 1, backgroundColor: "#FEF7FF", borderRadius: "6px", overflowY: "auto", padding: "10px" }}>
                    
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                        <img
                            src={playlist.ownerAvatar || "/default-avatar.png"}
                            alt="avatar"
                            style={{ width: 50, height: 50, borderRadius: "50%", marginRight: "15px" }}
                        />
                        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                            <span style={{ color: "#1D1B20", fontWeight: "bold", fontSize: "16px" }}>
                                {playlist.name}
                            </span>
                            <span style={{ color: "#1D1B20", fontSize: "14px" }}>
                                {playlist.ownerName}
                            </span>
                            <span style={{ color: "#2F80ED", fontSize: "14px" }}>
                                {playlist.songs.length} songs
                            </span>
                        </Box>
                    </div>

                    {/* Songs list */}
                    {playlist.songs.map((song, index) => (
                        <div
                            key={song._id || index}
                            onClick={() => handleSongClick(index)}
                            style={{
                                backgroundColor: index === currentSongIndex ? "#F7E965" : "#FFF7B2",
                                color: "#C20CB9",
                                borderRadius: "6px",
                                padding: "10px",
                                marginBottom: "10px",
                                cursor: "pointer",
                                fontWeight: index === currentSongIndex ? "bold" : "normal"
                            }}
                        >
                            {index + 1}. {song.title} by {song.artist} ({song.year})
                        </div>
                    ))}
                </div>

 
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <div id="yt-player" style={{ width: "100%", height: "300px" }}></div>

                    <div style={{
                        backgroundColor: "#d3d3d3",
                        borderRadius: "8px",
                        padding: "15px 20px",
                        display: "flex",
                        gap: "20px",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "24px",
                        color: "#333333"
                    }}>
                        <button onClick={handlePrev} style={{ cursor: "pointer", fontSize: "24px", color: "#111" }}>⏮️</button>
                        <button onClick={togglePlayPause} style={{ cursor: "pointer", fontSize: "24px", color: "#111" }}>
                            {isPlaying ? "⏸️" : "▶️"}
                        </button>
                        <button onClick={handleNext} style={{ cursor: "pointer", fontSize: "24px", color: "#111" }}>⏭️</button>
                    </div>

                    <div style={{
                        marginTop: "auto",
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "15px 20px"
                    }}>
                        <label style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            color: repeat ? "#FFFFFF" : "#000",
                            backgroundColor: repeat ? "#0E8503" : "#FFF",
                            padding: "5px 10px",
                            borderRadius: "6px"
                        }}>
                            <input
                                type="checkbox"
                                checked={repeat}
                                onChange={toggleRepeat}
                                style={{ cursor: "pointer" }}
                            /> Repeat
                        </label>

                        <button
                            onClick={onClose}
                            style={{
                                backgroundColor: "#0E8503",
                                color: "white",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "6px",
                                cursor: "pointer"
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

PlayPlaylistModal.propTypes = {
    playlist: PropTypes.shape({
        name: PropTypes.string.isRequired,
        ownerName: PropTypes.string.isRequired,
        ownerAvatar: PropTypes.string,
        songs: PropTypes.arrayOf(PropTypes.shape({
            _id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            artist: PropTypes.string.isRequired,
            year: PropTypes.number.isRequired,
            youTubeId: PropTypes.string.isRequired
        })).isRequired
    }).isRequired,
    onClose: PropTypes.func.isRequired
};
