const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    from: {
        type: String
    },
    to: {
        type: String
    },
    date: {
        type: Date
    },
    subject: {
        type: String
    },
    body: {
        type: String
    }
});

module.exports = mongoose.model('email', EmailSchema);
