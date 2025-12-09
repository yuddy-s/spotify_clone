

var playlistBaseURL = 'http://localhost:4000/api/playlist' 
var songBaseURL = 'http://localhost:4000/api/song'


export const getAllPlaylists = async (options = {}) => {
    // options: { playlistName, ownerName, songTitle, songArtist, songYear, sortBy, order }
    const params = new URLSearchParams(options).toString();
    const response = await fetch(`${playlistBaseURL}/?${params}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return { status: response.status, data };
};

// Get playlist pairs (public)
export const getPlaylistPairs = async () => {
    const response = await fetch(playlistBaseURL + "/pairs", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return { status: response.status, data };
};

// Get playlist by id (public)
export const getPlaylistById = async (id) => {
    const response = await fetch(playlistBaseURL + `/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return { status: response.status, data };
};

// Play a playlist (public)
export const playPlaylist = async (id) => {
    const response = await fetch(playlistBaseURL + `/${id}/play`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return { status: response.status, data };
};

// ======================
// ACCOUNT-ONLY ROUTES (require auth)
// ======================

export const createPlaylist = async (newListName, newSongs) => {
    const response = await fetch(playlistBaseURL + "/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: newListName,
            songs: newSongs,
        }),
        credentials: "include"
    });
    const data = await response.json();
    return { status: response.status, data };
};

export const updatePlaylistById = async (id, playlist) => {
    const response = await fetch(playlistBaseURL + `/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlist }),
        credentials: "include"
    });
    const data = await response.json();
    return { status: response.status, data };
};

export const deletePlaylistById = async (id) => {
    const response = await fetch(playlistBaseURL + `/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    });
    const data = await response.json();
    return { status: response.status, data };
};

// logged in users only
export const copyPlaylist = async (id) => {
    const response = await fetch(playlistBaseURL + `/${id}/copy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    });
    const data = await response.json();
    return { status: response.status, data };
};

// SONG REQUEST METHODS --------------------------
export const getAllSongs = async () => {
    const response = await fetch(`${songBaseURL}/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    console.log("getAllSongs response:", data);
    return { status: response.status, data };
};

 
export const createSong = async () => {
    const newSongData = {
        title: "Untitled",
        artist: "???",
        year: 2000,
        youTubeId: "dQw4w9WgXcQ"  
    };

    const response = await fetch(songBaseURL + "/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newSongData)
    });

    const data = await response.json();
    return { status: response.status, data };
};

// owner-only / requires auth
export const updateSongById = async (id, song) => {
    const response = await fetch(songBaseURL + `/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( song ),
        credentials: "include"
    });
    const data = await response.json();
    return { status: response.status, data };
};

// owner-only / requires auth
export const deleteSongById = async (id) => {
    const response = await fetch(songBaseURL + `/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    });
    const data = await response.json();
    return { status: response.status, data };
};


export const incrementSongPlays = async (id) => {
    const response = await fetch(songBaseURL + `/${id}/play`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return { status: response.status, data };
};

const apis = {
    getAllPlaylists,
    getPlaylistPairs,
    getPlaylistById,
    playPlaylist,
    createPlaylist,
    updatePlaylistById,
    deletePlaylistById,
    copyPlaylist,
    getAllSongs,
    createSong,
    updateSongById,
    deleteSongById,
    incrementSongPlays
};

export default apis;