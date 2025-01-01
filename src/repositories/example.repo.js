/* 
const BaseRepository = require("./base.repo.js");
const User = require("../models/User"); // Mô hình User (ví dụ dùng Mongoose)

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        return this.model.findOne({ email });
    }
}

module.exports = new UserRepository();
 */
