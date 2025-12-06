const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    artist: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true
    },
    youTubeId: {
        type: String,
        required: true
    },

    playlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist',
        default: []
    }],

    listens: {
        type: Number,
        default: 0
    },

    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
    
}, { timestamps: true });

SongSchema.index({ title: 1, artist: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Song', SongSchema);
