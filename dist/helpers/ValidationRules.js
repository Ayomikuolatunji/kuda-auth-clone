"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationRules = void 0;
const express_validator_1 = require("express-validator");
class ValidationRules {
}
exports.ValidationRules = ValidationRules;
ValidationRules.createApplicant = [
    (0, express_validator_1.body)("firstName").notEmpty().withMessage("First name is required"),
    (0, express_validator_1.body)("lastName").notEmpty().withMessage("Last name is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email"),
    (0, express_validator_1.body)("phone").notEmpty().withMessage("Phone number is required"),
];
ValidationRules.applicantIdParam = (0, express_validator_1.param)("applicantId")
    .notEmpty()
    .withMessage("Applicant ID is required");
