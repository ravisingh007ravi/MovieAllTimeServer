const mongoose = require('mongoose');
const { ValidName, Validemail, Validpass } = require('../validation/validations')

const authorSchema = new mongoose.Schema({
    profileimg: { type: String, required: false, trim: true },
    name: { 
        type: String, required: [true, 'Please Provide Name'],
        validate:[ValidName, 'Invalid Name'], trim: true 
    },
    email: { 
        type: String, required: [true, 'Please Provide Email_Id'],
        validate:[Validemail, 'Invalid Email'], unique: true, trim: true 
    },
    password: { 
        type: String, required: [true, 'Please Provide Password'],
        validate:[Validpass, 'Invalid Password'], trim: true 
    },
    role: { 
        type: String,
        enum:['Admin','Customer','Shopkeeper'],
        required: true, trim: true 
    },
    isDeleted: { type: String, default: false, trim: true },
    isVerify: { type: String, default: false, trim: true }
    
    
},
    { timestamps: true }
)

module.exports = mongoose.model('userDB', authorSchema);