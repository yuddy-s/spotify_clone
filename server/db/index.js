const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

console.log("MONGO_URI =", process.env.MONGO_URI);

const Playlist = require('../models/playlist-model')
const User = require('../models/user-model')
const Song = require('../models/song-model')


class MongoDBManager {
    constructor() {
        this.models = { Playlist, User, Song };
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
