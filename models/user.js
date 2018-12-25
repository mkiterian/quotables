const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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

UserSchema.statics.findByToken = function(token) {
  let decoded = null;
  try {
    decoded = jwt.verify(token, "secret123");
  } catch (err) {
    return Promise.reject();
  }

  return this.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

UserSchema.statics.findByCredentials = function(email, password) {
  return User.findOne({ email }).then(user => {
    if (!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre("save", function(next) {
  if (this.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.methods.toJSON = function() {
  userObject = this.toObject();
  const { _id, email } = userObject;
  return { _id, email };
};

UserSchema.methods.generateAuthToken = function() {
  // token needs an expiration time
  const access = "auth";
  const token = jwt
    .sign({ _id: this._id.toHexString(), access }, "secret123")
    .toString();
  this.tokens.push({ access, token });
  return this.save().then(() => token);
};

const User = mongoose.model("User", UserSchema);

module.exports = { User };
