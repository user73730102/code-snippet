const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SnippetSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Links this snippet to a User
        required: true
    },
    title: {
        type: String,
        trim: true,
        default: 'Untitled Snippet'
    },
    language: {
        type: String,
        trim: true,
        default: 'javascript'
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Snippet', SnippetSchema);