const { body } = require("express-validator");

exports.createProjectValidator = [
  body("name")
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ min: 3 })
    .withMessage("Project name must be at least 3 characters"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];