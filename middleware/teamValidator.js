const { body } = require("express-validator");

// --- Validator for creating a team ---
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

  body("members")
    .optional()
    .isArray()
    .withMessage("Members must be an array of user IDs"),
  
  body("members.*")
    .optional()
    .isMongoId()
    .withMessage("Each member must be a valid user ID"),
];

// --- Validator for updating team members ---
exports.updateTeamMembersValidator = [
  body("addMembers")
    .optional()
    .isArray()
    .withMessage("addMembers must be an array of user IDs"),
  body("addMembers.*")
    .optional()
    .isMongoId()
    .withMessage("Each added member must be a valid user ID"),

  body("removeMembers")
    .optional()
    .isArray()
    .withMessage("removeMembers must be an array of user IDs"),
  body("removeMembers.*")
    .optional()
    .isMongoId()
    .withMessage("Each removed member must be a valid user ID"),
];
