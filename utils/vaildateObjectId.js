const { ObjectID } = require("mongodb");

const validateObjectId = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send({
      message: "not found"
    });
  }
  next();
}

module.exports = validateObjectId;
