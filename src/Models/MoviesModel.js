const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    profileImg: { type: String, required: false, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    otp: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false },
    isVerify: { type: Boolean, default: false },
    AdminOTPAuth: { type: String, required: true, trim: true },
    isAccountActive: { type: Boolean, default: true },
    role: { type: String, enum: ['user', 'admin'], required: true, trim: true } 
},
    { timestamps: true }
)

module.exports = mongoose.model('movieDB', movieSchema); 