const mongoose = require("mongoose");
const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});




const User = mongoose.model('User', userSchema);


const registerValidation = (obj) => {
    const schema = joi.object({
        email: joi.string().trim().min(5).max(100).required(),
        password: passwordComplexity().trim().min(3).max(100).required(),
        isAdmin: joi.boolean()
    })

    return schema.validate(obj);
}


const loginValidation = (obj) => {
    const schema = joi.object({
        email: joi.string().trim().min(5).max(100).required(),
        password: passwordComplexity().trim().min(3).max(100).required()
    })

    return schema.validate(obj)
}


module.exports = { User, registerValidation, loginValidation }