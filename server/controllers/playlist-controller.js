const auth = require('../auth')
const db = require('../db')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
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

        let playlist;
        if ('playlists' in user) {
            playlist = await db.create('Playlist', {
                name: body.name,
                songs: body.songs || [],
                ownerEmail: user.email
            });
            user.playlists.push(playlist._id);
            await db.update('User', { _id: userId }, { playlists: user.playlists });
        } else {

            playlist = await db.create('Playlist', {
                name: body.name,
                songs: body.songs || [],
                ownerEmail: user.email
            });
        }

        return res.status(201).json({ playlist });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: 'Playlist not created!' });
    }
};

deletePlaylist = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) {
        return res.status(400).json({ errorMessage: 'UNAUTHORIZED' });
    }

    try {
        const playlist = await db.findById('Playlist', req.params.id);
        if (!playlist) return res.status(404).json({ errorMessage: 'Playlist not found!' });

        const owner = await db.findOne('User', { email: playlist.ownerEmail });
        if (!owner || owner._id != userId) {
            return res.status(400).json({ errorMessage: 'authentication error' });
        }

        await db.findOneAndDelete('Playlist', { _id: req.params.id });

        owner.playlists = owner.playlists.filter(id => id != req.params.id);
        await db.update('User', { _id: userId }, { playlists: owner.playlists });

        return res.status(200).json({});
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: 'Failed to delete playlist' });
    }
}
getPlaylistById = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(400).json({ errorMessage: 'UNAUTHORIZED' });

    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

   try {
        const playlist = await db.findById('Playlist', req.params.id);
        if (!playlist) return res.status(404).json({ success: false, errorMessage: 'Playlist not found' });

        const owner = await db.findOne('User', { email: playlist.ownerEmail });
        if (!owner || owner._id != userId) {
            return res.status(400).json({ success: false, description: 'authentication error' });
        }

        return res.status(200).json({ success: true, playlist });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, errorMessage: 'Error fetching playlist' });
    }
};

getPlaylistPairs = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(400).json({ errorMessage: 'UNAUTHORIZED' });

    console.log("getPlaylistPairs");

    try {
        const user = await db.findById('User', userId);
        if (!user) return res.status(404).json({ errorMessage: 'User not found' });

        console.log("find user with id " + req.userId);
        console.log("find all Playlists owned by " + user.email);

        const playlists = await db.findAll('Playlist', { ownerEmail: user.email });
        if (!playlists || playlists.length === 0) return res.status(404).json({ success: false, error: 'Playlists not found' });
        console.log("found Playlists: " + JSON.stringify(playlists));

        const idNamePairs = playlists.map(list => ({ _id: list._id, name: list.name }));

        return res.status(200).json({ success: true, idNamePairs });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, errorMessage: 'Error fetching playlist pairs' });
    }
}
getPlaylists = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(400).json({ errorMessage: 'UNAUTHORIZED' });

    try {
        const playlists = await db.findAll('Playlist');
        if (!playlists || playlists.length === 0) return res.status(404).json({ success: false, error: 'Playlists not found' });

        return res.status(200).json({ success: true, data: playlists });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, errorMessage: 'Error fetching playlists' });
    }
}
updatePlaylist = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(400).json({ errorMessage: 'UNAUTHORIZED' });

    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    try {
        const playlist = await db.findById('Playlist', req.params.id);
        if (!playlist) return res.status(404).json({ success: false, message: 'Playlist not found!' });

        const owner = await db.findOne('User', { email: playlist.ownerEmail });
        if (!owner || owner._id != userId) {
            return res.status(400).json({ success: false, description: 'authentication error' });
        }

        playlist.name = body.playlist.name;
        playlist.songs = body.playlist.songs;

        await db.update('Playlist', { _id: playlist._id }, { name: playlist.name, songs: playlist.songs });

        return res.status(200).json({ success: true, id: playlist._id, message: 'Playlist updated!' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, errorMessage: 'Failed to update playlist' });
    }
}
module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist
}