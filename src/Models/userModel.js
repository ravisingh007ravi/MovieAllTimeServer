const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    profileImg: { type: String, required: false, trim: true },
    title: { type: String, enum: ['Mr', 'Miss','Other'], required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    otp: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false },
    isVerify: { type: Boolean, default: false },
    isAccountActive: { type: Boolean, default: true },
    role: { type: String, enum: ['user', 'admin'], required: true, trim: true } 
},
    { timestamps: true }
)

module.exports = mongoose.model('user', userSchema);