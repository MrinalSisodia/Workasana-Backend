
const { body } = require("express-validator");

exports.createTeamValidator = [
  body("name")
    .notEmpty()
    .withMessage("Team name is required")
    .isLength({ min: 3 })
    .withMessage("Team name must be at least 3 characters"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];
