
class DatabaseManager {
    async autoConnect() {
        throw new Error("autoConnect not implemented");
    }

    async connect() {
        throw new Error("connect not implemented");
    }

    async disconnect() {
        throw new Error("disconnect not imeplemented");
    }

    async findOne(modelName, query) {
        throw new Error("findOne not implemented");
    }

    async findById(modelName, id) {
        throw new Error("findById not implemented");
    }

    async findAll(modelName, query) {
        throw new Error("findAll not implemented");
    }

    async create(modelName, data) {
        throw new Error("create not implemented");
    }

    async findOneAndDelete(modelName, query) {
        throw new Error("findOneAndDelete not implemented");
    }

    async update(modelName, query, updateData) {
        throw new Error("update not implemented");
    }

    async clearCollection(modelName) {
        throw new Error("clearCollection not implemented")
    }
    
    async fillCollection(modelName, data) {
        throw new Error("fillCollection not implemented")
    }
}

module.exports = DatabaseManager;
