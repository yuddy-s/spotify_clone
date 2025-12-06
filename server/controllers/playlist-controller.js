const auth = require('../auth')
const db = require('../db')


createPlaylist = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });

    const body = req.body;
    if (!body || !body.name) {
        return res.status(400).json({ errorMessage: 'You must provide a valid playlist name.' });
    }

    try {
        const user = await db.findById('User', userId);
        if (!user) return res.status(404).json({ errorMessage: 'User not found' });

        // Check unique playlist name per user
        if (user.playlists.some(pid => {
            const pl = user.playlists.find(p => p._id.toString() === pid.toString());
            return pl && pl.name === body.name;
        })) {
            return res.status(400).json({ errorMessage: 'You already have a playlist with this name.' });
        }

        const playlist = await db.create('Playlist', {
            name: body.name,
            songs: body.songs || [],
            ownerId: user._id,
            listens: 0
        });

        // Update songs' playlists arrays
        for (const songId of (body.songs || [])) {
            const song = await db.findById('Song', songId);
            if (song && !song.playlists.includes(playlist._id)) {
                song.playlists.push(playlist._id);
                await db.update('Song', { _id: songId }, { playlists: song.playlists });
            }
        }

        user.playlists.push(playlist._id);
        await db.update('User', { _id: userId }, { playlists: user.playlists });

        return res.status(201).json({ playlist });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: 'Playlist not created!' });
    }
};



updatePlaylist = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });

    const body = req.body;
    if (!body || !body.playlist) {
        return res.status(400).json({ errorMessage: 'You must provide a body to update' });
    }

    try {
        const playlist = await db.findById('Playlist', req.params.id);
        if (!playlist) return res.status(404).json({ errorMessage: 'Playlist not found' });

        // Check ownership
        if (playlist.ownerId.toString() !== userId.toString()) {
            return res.status(403).json({ errorMessage: 'Not your playlist' });
        }

        const newSongs = body.playlist.songs.map(id => id.toString());
        const oldSongs = playlist.songs.map(id => id.toString());

        // Songs added and removed
        const addedSongs = newSongs.filter(id => !oldSongs.includes(id));
        const removedSongs = oldSongs.filter(id => !newSongs.includes(id));

        // Update songs playlists arrays
        for (const songId of addedSongs) {
            const song = await db.findById('Song', songId);
            if (song && !song.playlists.includes(playlist._id)) {
                song.playlists.push(playlist._id);
                await db.update('Song', { _id: songId }, { playlists: song.playlists });
            }
        }

        for (const songId of removedSongs) {
            const song = await db.findById('Song', songId);
            if (song && song.playlists.includes(playlist._id)) {
                song.playlists = song.playlists.filter(pid => pid.toString() !== playlist._id.toString());
                await db.update('Song', { _id: songId }, { playlists: song.playlists });
            }
        }

        // Update playlist itself
        playlist.name = body.playlist.name;
        playlist.songs = newSongs;
        await db.update('Playlist', { _id: playlist._id }, { name: playlist.name, songs: playlist.songs });

        return res.status(200).json({ success: true, id: playlist._id, message: 'Playlist updated!' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: 'Failed to update playlist' });
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
    if (!userId) return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });

    try {
        const original = await db.findById('Playlist', req.params.id);
        if (!original) return res.status(404).json({ errorMessage: 'Original playlist not found' });

        const user = await db.findById('User', userId);

        const copy = await db.create('Playlist', {
            name: original.name + ' (Copy)',
            songs: original.songs,
            ownerId: user._id,
            listens: 0
        });

        // Update songs playlists arrays
        for (const songId of original.songs) {
            const song = await db.findById('Song', songId);
            if (song && !song.playlists.includes(copy._id)) {
                song.playlists.push(copy._id);
                await db.update('Song', { _id: songId }, { playlists: song.playlists });
            }
        }

        user.playlists.push(copy._id);
        await db.update('User', { _id: userId }, { playlists: user.playlists });

        return res.status(201).json({ playlist: copy });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: 'Failed to copy playlist' });
    }
};

getAllPlaylists = async (req, res) => {
    try {
        const { playlistName, ownerName, songTitle, songArtist, songYear, sortBy, order } = req.query;
        const sortOrder = order === 'desc' ? -1 : 1;

        // Build base sort criteria
        let sortCriteria = {};
        if (sortBy === 'name') sortCriteria.name = sortOrder;
        else if (sortBy === 'listens') sortCriteria.listens = sortOrder;
        else if (sortBy === 'owner') sortCriteria['ownerId.userName'] = sortOrder;
        else sortCriteria.createdAt = -1;

        //  Find playlists matching playlist name
        let playlistQuery = {};
        if (playlistName) playlistQuery.name = { $regex: playlistName, $options: 'i' }; // case-insensitive

        // Fetch playlists and populate owner and songs
        let playlists = await Playlist.find(playlistQuery)
            .populate('ownerId', 'userName')
            .populate('songs') // populate all song fields
            .exec();

        // Filter by ownerName and songs criteria
        playlists = playlists.filter(p => {
            const ownerMatch = ownerName
                ? p.ownerId.userName.toLowerCase().includes(ownerName.toLowerCase())
                : true;

            const songMatch = (songTitle || songArtist || songYear)
                ? p.songs.some(s =>
                    (!songTitle || s.title.toLowerCase().includes(songTitle.toLowerCase())) &&
                    (!songArtist || s.artist.toLowerCase().includes(songArtist.toLowerCase())) &&
                    (!songYear || s.year === parseInt(songYear))
                )
                : true;

            return ownerMatch && songMatch;
        });

        // Sort manually if owner sort (since populated fields)
        if (sortBy === 'owner') {
            playlists.sort((a, b) => {
                if (a.ownerId.userName < b.ownerId.userName) return -1 * sortOrder;
                if (a.ownerId.userName > b.ownerId.userName) return 1 * sortOrder;
                return 0;
            });
        }

        return res.status(200).json({ playlists });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: 'Error fetching playlists' });
    }
};

getPlaylistById = async (req, res) => {
    try {
        const playlist = await db.findById('Playlist', req.params.id);
        if (!playlist) return res.status(404).json({ errorMessage: 'Playlist not found' });
        return res.status(200).json({ playlist });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: 'Error fetching playlist' });
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
        const idNamePairs = playlists.map(p => ({ _id: p._id, name: p.name }));
        return res.status(200).json({ idNamePairs });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: 'Error fetching playlist pairs' });
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