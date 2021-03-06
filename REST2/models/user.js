const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength: 6,
        
    },
    email:{
     type:String,
     minlength:12,
     unique:true,
     required:true,

     validate(value) {
        if(!validator.isEmail(value)){
            throw new Error('Email is not valid');
        }
    }

    },
    password:{
        type:String,
        minlength:6,
        required:true,
        lowercase:true
         
    }
});
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id}, 'thisismynewcourse')
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatched = await bcrypt.compare(password, user.password)

    if (!isMatched) {
        throw new Error('Unable to login')
    }

    return user
}

userSchema.pre('save', async function (next)  {
console.log('Before save')
const user = this
if(user.isModified('password')){
  user.password = await bcrypt.hash(user.password, 8)
}
next()
});
 

module.exports = mongoose.model('User', userSchema)
