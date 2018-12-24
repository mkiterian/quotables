const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: props => `${props.value} is not a valid email address`
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 8
  },
  tokens: [
    {
      access: { type: String, required: true },
      token: { type: String, required: true }
    }
  ]
});

UserSchema.methods.toJSON = function() {
  userObject = this.toObject();
  const { _id, email } = userObject;
  return { _id, email };
};

UserSchema.methods.generateAuthToken = function() {
  const access = "auth";
  const token = jwt
    .sign({ _id: this._id.toHexString(), access }, "secret123")
    .toString();
  this.tokens.push({ access, token });
  return this.save().then(() => token);
};

const User = mongoose.model("User", UserSchema);

module.exports = { User };
