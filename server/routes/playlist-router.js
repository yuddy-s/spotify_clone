/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()
const auth = require('../auth')

// public routes
router.get('/', PlaylistController.getAllPlaylists); 
router.get('/pairs', PlaylistController.getPlaylistPairs) 
router.get('/:id', PlaylistController.getPlaylistById) 

// owner only
router.post('/create', auth.verify, PlaylistController.createPlaylist) 
router.put('/:id', auth.verify, PlaylistController.updatePlaylist) 
router.delete('/:id', auth.verify, PlaylistController.deletePlaylist) 

router.post('/:id/copy', auth.verify, PlaylistController.copyPlaylist)
router.post('/:id/play', PlaylistController.playPlaylist)

module.exports = router