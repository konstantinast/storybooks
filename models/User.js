const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    googleID: {
       type: String,
       required: true // in situation where we would decide to use more auth methods than google, then remove required
    },
    email: {
       type: String,
       required: true 
    },
    firstName: {
       type: String
    },
    lastName: {
        type: String
    },
    image: {
        type: String
    }
});

// Create collection and add schema
mongoose.model('users', UserSchema);