const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const DatabaseManager = require('../db-manager');
console.log("MONGO_URI =", process.env.MONGO_URI);

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        songs: [{
            title: String,
            artist: String,
            year: Number,
            youTubeId: String
        }]
    },
    { timestamps: true }
);

const userSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        passwordHash: { type: String, required: true },
        playlists: [{ type: ObjectId, ref: 'Playlist' }]
    },
    { timestamps: true }
);

const Playlist = mongoose.model('Playlist', playlistSchema);
const User = mongoose.model('User', userSchema);

class MongoDBManager extends DatabaseManager {
    constructor() {
        super();
        this.models = { Playlist, User };
        this.connected = false;
    }

    async autoConnect() {
        if (!mongoose.connection.readyState) { 
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log("MongoDB auto-connected");
        }
    }

    async connect() {
        if (!this.connected) {
            await this.autoConnect(); 
            this.connected = true;
        }
    }

    async disconnect() {
            if (this.connected) {
                await mongoose.disconnect();
                this.connected = false;
                console.log("MongoDB disconnected!");
            }
    }

    async findOne(modelName, query) {
        if(modelName === 'User') {
            return this.models[modelName].findOne(query).populate('playlists').exec()
        }
        return this.models[modelName].findOne(query).exec();
    }

    async findById(modelName, id) {
        return this.models[modelName].findById(id).exec();
    }

    async findAll(modelName, query = {}) {
        return this.models[modelName].find(query).exec();
    }

    async create(modelName, data) {
        const doc = new this.models[modelName](data);
        return doc.save();
    }

    async findOneAndDelete(modelName, query) {
        return this.models[modelName].findOneAndDelete(query).exec();
    }

    async update(modelName, query, updateData) {
        return this.models[modelName].findOneAndUpdate(query, updateData, { new: true }).exec()
    }

    async clearCollection(modelName) {
        const model = this.models[modelName];
        if (!model) throw new Error(`Model ${modelName} not found`);
        await model.deleteMany({});
        console.log(`${modelName} cleared`);
    }

    async fillCollection(modelName, data) {
        const model = this.models[modelName];
        if (!model) throw new Error(`Model ${modelName} not found`);

        const createdDocs = [];
        for (const item of data) {
            const doc = new model(item);
            const saved = await doc.save();
            createdDocs.push(saved);
        }

        console.log(`${modelName} filled`);
        return createdDocs;
    }
}

module.exports = new MongoDBManager();
