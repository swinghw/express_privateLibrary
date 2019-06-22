const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
let userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
      },
    password: {
        type: String,
        required: true
      },
      passResetKey: String,
      passKeyExpires: Number,
      createdAt: {
        type: Date,
        required: false
      },
      updatedAt: {
        type: Number,
        required: false
      },
     },
 // 'runSettersOnQuery' is used to implement the specifications in our model schema such as the 'trim' option.      
    {runSettersOnQuery: true});

    userSchema.pre('save', function (next) {
        this.username = this
          .username
          .toLowerCase(); // ensure email are in lowercase
      
        var currentDate = new Date().getTime();
        this.updatedAt = currentDate;
        if (!this.created_at) {
          this.createdAt = currentDate;
        }
        next();
      });
      
    module.exports = mongoose.model('user', userSchema);     