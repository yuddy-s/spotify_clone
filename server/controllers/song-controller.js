const auth = require('../auth');
const db = require('../db');



getAllSongs = async (req, res) => {
    try {
        const songs = await db.findAll('Song');
        return res.status(200).json({ success: true, data: songs });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, errorMessage: 'Error fetching songs' });
    }
};


createSong = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });

    const { title, artist, year, youTubeId } = req.body;
    if (!title || !artist || !year || !youTubeId) {
        return res.status(400).json({ errorMessage: 'All fields are required' });
    }

    try {
        const newSong = await db.create('Song', {
            title,
            artist,
            year,
            youTubeId,
            listens: 0,
            ownerId: userId
        });

        return res.status(201).json({ success: true, song: newSong });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, errorMessage: 'Failed to create song' });
    }
};


updateSong = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });

    try {
        const song = await db.findById('Song', req.params.id);
        if (!song) return res.status(404).json({ errorMessage: 'Song not found' });

        if (!song.ownerId.equals(userId)) {
            return res.status(403).json({ errorMessage: 'You can only edit your own songs' });
        }

        const { title, artist, year, youTubeId } = req.body;
        song.title = title || song.title;
        song.artist = artist || song.artist;
        song.year = year || song.year;
        song.youTubeId = youTubeId || song.youTubeId;

        await db.update('Song', { _id: song._id }, {
            title: song.title,
            artist: song.artist,
            year: song.year, 
            youTubeId: song.youTubeId
        });
        return res.status(200).json({ success: true, song });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, errorMessage: 'Failed to update song' });
    }
};


deleteSong = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });

    try {
        const song = await db.findById('Song', req.params.id);
        if (!song) return res.status(404).json({ errorMessage: 'Song not found' });

        if (!song.ownerId.equals(userId)) {
            return res.status(403).json({ errorMessage: 'You can only delete your own songs' });
        }

        await db.findOneAndDelete('Song', { _id: req.params.id });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, errorMessage: 'Failed to delete song' });
    }
};

incrementSongPlays = async (req, res) => {
    try {
        const song = await db.findById('Song', req.params.id);
        if (!song) return res.status(404).json({ errorMessage: 'Song not found' });

        song.listens = (song.listens || 0) + 1;
        await db.update('Song', { _id: song._id }, { listens: song.listens });

        return res.status(200).json({ success: true, song });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, errorMessage: 'Failed to increment song plays' });
    }
};

module.exports = {
    getAllSongs,
    createSong,
    updateSong,
    deleteSong,
    incrementSongPlays
};
