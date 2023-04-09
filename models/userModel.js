const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
       type: String,
       required: true,
       trim: true,
       lowercase: true
     },
    email: {
       type: String,
       required: true,
       unique: true,
       lowercase: true,
         validate( value ) {
               if( !validator.isEmail( value )) {
                    throw new Error( 'Email is invalid' )
                     }
                }
      },
    password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
    select: false,
    },
    passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
        // This only works on CREATE and Save!!
        validator: function (el) {
        return el === this.password;
        },
        message: 'Password are not the same!',
    },
    },
    createdAt: {
    type: Date,
    default: Date.now,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
    type: Boolean,
    default: true,
    select: false,
    }
});
    
userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
    
    // Hash the password with the cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
    });
    
    userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.new) return next();
    
    this.passwordChangedAt = Date.now() - 1000;
    next();
    });
    
// userSchema.pre('save', function (next) {
//     // Check if the number starts with +254
//     if (this.phone.toString().startsWith('+254')) {
//         // Remove the plus sign
//         this.phone = Number(this.number.slice(1));
//     }
    
//     next();
//     });
    
userSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
    });
    
    userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
    ) {
    return await bcrypt.compare(candidatePassword, userPassword);
    };
    
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
        );
    
        return JWTTimestamp < changedTimeStamp;
    }
    
    // False means NOT changed
    return false;
    };
    
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    // console.log({ resetToken }, this.passwordResetToken);
    
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    
    return resetToken;
    };
    
const User = mongoose.model('User', userSchema);
    
module.exports = User;
    