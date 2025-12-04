
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    ownerEmail: {
        type: String,
        required: true,
        lowercase: true
    },

    songs: [{
        type: Schema.Types.ObjectId,
        ref: 'Song'
    }],

    listens: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Playlist', PlaylistSchema);
