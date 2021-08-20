const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        max: 50,
        required: true,
        lowercase: true
    },
    username: {
        type: String,
        unique: true,
        max: 50,
        required: true,
        lowercase: true,
        min: 3
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type : Date,
        required: true
    },
    dateOfRegistration: {
        type : Date,
        default: Date.now
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    followers: {
        type: Array,
        default: [],
    },
    following: {
        type: Array,
        default: [],
    },
    likes: {
        type: Array,
        default: [],
    },
    dislikes: {
        type: Array,
        default: [],
    },
    description: {
        type: String,
        default: '',
        max: 500
    }
});

userSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if(err){
            return next(err);
        }

        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err){
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword){
    const user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if(err){
                return reject(err);
            }

            if(!isMatch){
                return reject(false);
            }
            
            resolve(true);
        });
    });
}

const User = mongoose.model('User', userSchema);

module.exports = User;

