class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async find(
        query = {},
        options = { limit: "10", skip: 0, sort: {}, lean: true },
    ) {
        const { limit = "10", skip = 0, sort = {}, lean = true } = options;

        return await this.model
            .find(query)
            .limit(Number(limit))
            .skip(skip)
            .sort(sort)
            .lean(lean);
    }

    async findOne(query = {}, options = {}) {
        const { lean = true } = options;

        return this.model.find(query).lean(lean);
    }

    async findById(id, options = {}) {
        const { lean = true } = options;

        return this.model.findById(id).lean(lean);
    }

    async create(data) {
        const newItem = new this.model(data);
        return newItem.save();
    }

    async findOneAndUpdate(query, data, options = { new: true }) {
        return this.model.findOneAndUpdate(query, data, options);
    }

    async updateOne(query, data, options = {}) {
        return this.model.updateOne(query, data, options);
    }

    async updateMany(query, data, options = {}) {
        return this.model.updateMany(query, data, options);
    }

    async findOneAndDelete(query, options = {}) {
        return this.model.findOneAndDelete(query, options);
    }

    async deleteOne(query, options = {}) {
        return this.model.deleteOne(query, options);
    }

    async deleteMany(query, options = {}) {
        return this.model.deleteMany(query, options);
    }
}

module.exports = BaseRepository;
