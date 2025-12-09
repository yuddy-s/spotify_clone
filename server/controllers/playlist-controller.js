const auth = require('../auth')
const db = require('../db')


createPlaylist = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ success: false, errorMessage: 'UNAUTHORIZED' });

    try {
        const user = await db.findById('User', userId);
        if (!user) return res.status(404).json({ success: false, errorMessage: 'User not found' });

        let { name, songs } = req.body;
        songs = songs || [];

        // generate untitled playlist name
        if (!name || !name.trim()) {
            const userPlaylists = (await db.findAll('Playlist')).filter(p => p.ownerId.toString() === user._id.toString());
            const existingNames = userPlaylists.map(p => p.name);

            let i = 0;
            let defaultName;
            do {
                defaultName = `Untitled${i}`;
                i++;
            } while (existingNames.includes(defaultName));

            name = defaultName;
        }

        const playlist = await db.create('Playlist', { name, songs, ownerId: user._id, listens: 0 });

        // graceful songs handling
        for (const songId of songs) {
            const song = await db.findById('Song', songId);
            if (song && !song.playlists.includes(playlist._id)) {
                song.playlists.push(playlist._id);
                await db.update('Song', { _id: songId }, { playlists: song.playlists });
            }
        }

        user.playlists.push(playlist._id);
        await db.update('User', { _id: userId }, { playlists: user.playlists });

        return res.status(201).json({ success: true, playlist });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, errorMessage: 'Playlist not created!' });
    }
};



updatePlaylist = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ success: false, errorMessage: 'UNAUTHORIZED' });

    const body = req.body;
    if (!body || !body.playlist) return res.status(400).json({ success: false, errorMessage: 'No playlist data provided' });

    try {
        const playlist = await db.findById('Playlist', req.params.id);
        if (!playlist) return res.status(404).json({ success: false, errorMessage: 'Playlist not found' });

        if (playlist.ownerId.toString() !== userId.toString())
            return res.status(403).json({ success: false, errorMessage: 'Not your playlist' });

        // Name uniqueness check
        const userPlaylists = await db.findAll('Playlist');
        if (userPlaylists.some(p => p.ownerId.toString() === userId.toString() && p._id.toString() !== playlist._id.toString() && p.name === body.playlist.name)) {
            return res.status(400).json({ success: false, errorMessage: 'Playlist name already exists' });
        }

        const newSongs = (body.playlist.songs || []).map(String);
        const oldSongs = (playlist.songs || []).map(String);

        // Add / remove songs
        const added = newSongs.filter(id => !oldSongs.includes(id));
        const removed = oldSongs.filter(id => !newSongs.includes(id));

        for (const songId of added) {
            const song = await db.findById('Song', songId);
            if (song && !song.playlists.includes(playlist._id)) {
                song.playlists.push(playlist._id);
                await db.update('Song', { _id: songId }, { playlists: song.playlists });
            }
        }

        for (const songId of removed) {
            const song = await db.findById('Song', songId);
            if (song) {
                song.playlists = (song.playlists || []).filter(pid => pid.toString() !== playlist._id.toString());
                await db.update('Song', { _id: songId }, { playlists: song.playlists });
            }
        }

        playlist.name = body.playlist.name;
        playlist.songs = newSongs;
        await db.update('Playlist', { _id: playlist._id }, { name: playlist.name, songs: playlist.songs });

        return res.status(200).json({ success: true, playlist });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, errorMessage: 'Failed to update playlist' });
    }
};

deletePlaylist = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });

    try {
        const playlist = await db.findById('Playlist', req.params.id);
        if (!playlist) return res.status(404).json({ errorMessage: 'Playlist not found' });

        const owner = await db.findById('User', playlist.ownerId);
        if (!owner || owner._id.toString() !== userId.toString()) {
            return res.status(403).json({ errorMessage: 'Not your playlist' });
        }

        // Remove playlist ID from songs
        for (const songId of playlist.songs) {
            const song = await db.findById('Song', songId);
            if (song && song.playlists.includes(playlist._id)) {
                song.playlists = song.playlists.filter(pid => pid.toString() !== playlist._id.toString());
                await db.update('Song', { _id: songId }, { playlists: song.playlists });
            }
        }

        // Delete playlist
        await db.findOneAndDelete('Playlist', { _id: req.params.id });

        // Remove playlist from owner
        owner.playlists = owner.playlists.filter(id => id.toString() !== req.params.id);
        await db.update('User', { _id: userId }, { playlists: owner.playlists });

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: 'Failed to delete playlist' });
    }
};

copyPlaylist = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ success: false, errorMessage: 'UNAUTHORIZED' });

    try {
        const original = await db.findById('Playlist', req.params.id);
        if (!original) return res.status(404).json({ success: false, errorMessage: 'Original playlist not found' });

        const user = await db.findById('User', userId);

        // Ensure unique name
        let newName = original.name + ' (Copy)';
        const userPlaylists = await db.findAll('Playlist');
        let i = 1;
        while (userPlaylists.some(p => p.ownerId.toString() === userId.toString() && p.name === newName)) {
            newName = `${original.name} (Copy ${i})`;
            i++;
        }

        const copy = await db.create('Playlist', {
            name: newName,
            songs: original.songs,
            ownerId: user._id,
            listens: 0
        });

        for (const songId of original.songs) {
            const song = await db.findById('Song', songId);
            if (song && !song.playlists.includes(copy._id)) {
                song.playlists.push(copy._id);
                await db.update('Song', { _id: songId }, { playlists: song.playlists });
            }
        }

        user.playlists.push(copy._id);
        await db.update('User', { _id: userId }, { playlists: user.playlists });

        return res.status(201).json({ success: true, playlist: copy });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, errorMessage: 'Failed to copy playlist' });
    }
};

getAllPlaylists = async (req, res) => {
    try {
        const userId = auth.verifyUser(req);
        const {
            playlistName,
            ownerName,
            songTitle,
            songArtist,
            songYear,
            sortBy,
            order
        } = req.query;

        const sortOrder = order === "desc" ? -1 : 1;
        const hasFilters = playlistName || ownerName || songTitle || songArtist || songYear;

        if (!userId && !hasFilters) {
            return res.status(200).json({ playlists: [] });
        }

        // Build query
        const query = {};
        if (playlistName) query.name = { $regex: playlistName, $options: "i" };

        // Fetch all matching playlists
        let playlists = await db.findAll('Playlist', query);

        // Populate ownerId and songs manually
        playlists = await Promise.all(playlists.map(async p => {
            const owner = await db.findById('User', p.ownerId);
            const songs = await Promise.all((p.songs || []).map(sid => db.findById('Song', sid)));
            return { ...p.toObject(), ownerId: owner, songs };
        }));

        // Filter by owner and songs
        if (userId && !hasFilters) {
            playlists = playlists.filter(p => p.ownerId._id.toString() === userId.toString());
        }

        playlists = playlists.filter(p => {
            const ownerMatch = ownerName
                ? p.ownerId.userName.toLowerCase().includes(ownerName.toLowerCase())
                : true;

            const songMatch = (songTitle || songArtist || songYear)
                ? p.songs.some(s =>
                    s &&
                    (!songTitle || s.title.toLowerCase().includes(songTitle.toLowerCase())) &&
                    (!songArtist || s.artist.toLowerCase().includes(songArtist.toLowerCase())) &&
                    (!songYear || s.year === parseInt(songYear))
                )
                : true;

            return ownerMatch && songMatch;
        });

        // Sorting
        if (sortBy === "name") {
            playlists.sort((a, b) => a.name.localeCompare(b.name) * sortOrder);
        } else if (sortBy === "listens") {
            playlists.sort((a, b) => (a.listens - b.listens) * sortOrder);
        } else if (sortBy === "owner") {
            playlists.sort((a, b) => a.ownerId.userName.localeCompare(b.ownerId.userName) * sortOrder);
        } else {
            playlists.sort((a, b) => b.createdAt - a.createdAt);
        }

        return res.status(200).json({ playlists });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ playlists: [], errorMessage: "Error fetching playlists" });
    }
};

getPlaylistById = async (req, res) => {
    try {
        const playlist = await db.findById('Playlist', req.params.id);
        if (!playlist) return res.status(404).json({ errorMessage: "Playlist not found" });

        const owner = await db.findById('User', playlist.ownerId);
        const ownerName = owner ? owner.userName : "Unknown";
        const ownerAvatar = owner ? owner.avatar : "/default-avatar.png";

        // populate full song objects
        const songs = [];
        for (const songId of playlist.songs || []) {
            const song = await db.findById('Song', songId);
            if (song) {
                songs.push({
                    _id: song._id.toString(),
                    title: song.title,
                    artist: song.artist,
                    year: song.year,
                    youTubeId: song.youTubeId
                });
            }
        }

        return res.status(200).json({
            success: true,
            playlist: {
                _id: playlist._id,
                name: playlist.name,
                ownerName,
                ownerAvatar,
                listens: playlist.listens || 0,
                songs
            }
        });
    } catch (err) {
        console.error("getPlaylistById error:", err);
        return res.status(500).json({ errorMessage: "Error fetching playlist" });
    }
};

playPlaylist = async (req, res) => {
    try {
        const playlist = await db.findById('Playlist', req.params.id);
        if (!playlist) return res.status(404).json({ errorMessage: 'Playlist not found' });

        playlist.listens += 1;
        await db.update('Playlist', { _id: playlist._id }, { listens: playlist.listens });

        return res.status(200).json({ success: true, listens: playlist.listens });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: 'Error playing playlist' });
    }
};


getPlaylistPairs = async (req, res) => {
    try {
        const playlists = await db.findAll('Playlist');
        const idNamePairs = await Promise.all(playlists.map(async (p) => {
            const owner = await db.findById('User', p.ownerId);
            return {
                _id: p._id,
                name: p.name,
                ownerName: owner?.userName || "Unknown",
                ownerAvatar: owner?.avatar || "https://i.pravatar.cc/40",
                listens: p.listens || 0
            };
        }));
        return res.status(200).json({ success: true, idNamePairs });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, errorMessage: 'Error fetching playlist pairs' });
    }
};

module.exports = {
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    copyPlaylist,
    getAllPlaylists,
    getPlaylistById,
    playPlaylist,
    getPlaylistPairs
};