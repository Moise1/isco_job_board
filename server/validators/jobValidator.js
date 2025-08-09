// validators/jobValidator.js
import Joi from "joi";

export const createJobSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  min_salary: Joi.number().optional(),
  max_salary: Joi.number().required(),
});

export const updateJobSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  description: Joi.string().optional(),
  location: Joi.string().optional(),
  min_salary: Joi.number().optional(),
  max_salary: Joi.number().optional(),
});


export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "id must be a number",
    "number.integer": "id must be an integer",
    "number.positive": "id must be a positive number",
    "any.required": "id parameter is required",
  }),
});