const express = require('express');
const router = express.Router();
const SongController = require('../controllers/song-controller');
const auth = require('../auth');

router.get('/', SongController.getAllSongs);
router.post('/', auth.verify, SongController.createSong);
router.put('/:id', auth.verify, SongController.updateSong);
router.delete('/:id', auth.verify, SongController.deleteSong);

router.post('/:id/play', SongController.incrementSongPlays);

module.exports = router;
