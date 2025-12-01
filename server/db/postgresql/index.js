const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
const DatabaseManager = require('../db-manager');

const sequelize = new Sequelize(process.env.PG_URI, {
    dialect: 'postgres',
    logging: console.log
});


const Playlist = sequelize.define('Playlist', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    ownerEmail: { type: DataTypes.STRING, allowNull: false },
    songs: { type: DataTypes.JSONB, allowNull: false }
}, { timestamps: true });

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: true });


// define relations
User.hasMany(Playlist, { foreignKey: 'ownerEmail', sourceKey: 'email' });
Playlist.belongsTo(User, { foreignKey: 'ownerEmail', targetKey: 'email' });


class PostgresManager extends DatabaseManager {
    constructor() {
        super();
        this.sequelize = sequelize;
        this.models = { Playlist, User };
        this.connected = false;
    }

        async connect() {
        if (!this.connected) {
            try {
                await this.sequelize.authenticate();
                await this.sequelize.sync();
                this.connected = true;
                console.log("PostgreSQL connected and synced!");
            } catch (err) {
                console.error("Postgres connection error:", err.message);
                throw err;
            }
        }
    }

    async disconnect() {
        if (this.connected) {
            await this.sequelize.close();
            this.connected = false;
            console.log("PostgreSQL disconnected!");
        }
    }

    autoConnect() {
        this.connect().catch(err => console.error("AutoConnect failed:", err));
    }

    
    _mapId(doc) {
        if (!doc) return null;
        const json = doc.toJSON();
        json._id = json.id;
        delete json.id;
        return json;
    }

    async findOne(modelName, query) {
        const whereQuery = { ...query };
        if (whereQuery._id) {
            whereQuery.id = whereQuery._id;
            delete whereQuery._id;
        }

        const doc = await this.models[modelName].findOne({
            where: whereQuery,
            include: modelName === 'User' ? [{ model: this.models.Playlist }] : []
        });

        if (!doc) return null;

        const json = doc.toJSON();

        if (json.playlists) {
            json.playlists = json.playlists.map(p => p.id);
        }

        json._id = json.id;
        delete json.id;

        return json;
    }

    async findById(modelName, id) {
        const doc = await this.models[modelName].findByPk(id);
        return this._mapId(doc);
    }

    async findAll(modelName, query = {}) {
        const whereQuery = { ...query };
        if (whereQuery._id) { 
            whereQuery.id = whereQuery._id; 
            delete whereQuery._id; 
        }

        const docs = await this.models[modelName].findAll({
            where: whereQuery,
            include: modelName === 'User' ? [{ model: this.models.Playlist }] : [],
        });

        return docs.map(doc => {
            const json = doc.toJSON();
            if (modelName === 'User') {
                json.playlists = (json.Playlists || []).map(pl => pl.id);
                delete json.Playlists;
            }
            json._id = json.id;
            delete json.id;
            return json;
        });
    }

    async create(modelName, data) {
        const doc = await this.models[modelName].create(data);
        return this._mapId(doc);
    }

    async findOneAndDelete(modelName, query) {
        const doc = await this.findOne(modelName, query);
        if (!doc) return null;
        await this.models[modelName].destroy({ where: { id: doc._id } });
        return doc;
    }

    async update(modelName, query, updateData) {
        const doc = await this.findOne(modelName, query);
        if (!doc) return null;
        await this.models[modelName].update(updateData, { where: { id: doc._id } });
        return this.findById(modelName, doc._id);
    }

    async clearCollection(modelName) {
        await this.models[modelName].destroy({ where: {}, truncate: true, cascade: true });
        console.log(`${modelName} cleared`);
    }

    async fillCollection(modelName, data) {
        const model = this.models[modelName];
        if (!model) throw new Error(`Model ${modelName} not found`);

        let createdDocs = [];
        if (modelName === "Playlist") {
            createdDocs = await model.bulkCreate(data, { returning: true });
        } else if (modelName === "User") {
            createdDocs = await model.bulkCreate(data);
        }
        console.log(`${modelName} filled`);
        return createdDocs;
    }

    async sync(force = false) {
        await this.sequelize.sync({ force });
        console.log("Postgres tables synced");
    }
}


module.exports = new PostgresManager();
