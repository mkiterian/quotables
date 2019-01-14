const { User } = require("../models/user");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = new User({ email, password });
    const user = await newUser.save();
    const token = await user.generateAuthToken();
    res.header("x-auth", token).send(newUser);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    if (user.tokens[0].token) {
      return res.header("x-auth", user.tokens[0].token).send({ user });
    }
    user.generateAuthToken().then(token => {
      res.header("x-auth", token).send({ user });
    });
  } catch (e) {
    res.status(500).json({ message: "there was an error logging in" });
  }
};

const logout = (req, res) => {
  req.user
    .deleteToken(req.token)
    .then(() => {
      res.status(200).send();
    })
    .catch(err => res.status.send(400));
};

module.exports = {
  register,
  login,
  logout
};
