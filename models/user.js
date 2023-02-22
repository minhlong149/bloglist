const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // checking the uniqueness of a field

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, 'username must be unique'],
    require: [true, 'username not found'],
    minLength: [3, 'username must be at least 3 characters long'],
  },
  name: String,
  passwordHash: {
    type: String,
    require: [true, 'password not found'],
    minLength: [3, 'password must be at least 3 characters long'],
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
