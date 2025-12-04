const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    avatar: {
        type: String, 
        default: ""   // base64 string
    },

    playlists: [{
        type: Schema.Types.ObjectId,
        ref: 'Playlist'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
