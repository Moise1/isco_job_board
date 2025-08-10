// validators/jobValidator.js
import Joi from "joi";

export const createJobSchema = Joi.object({

  title: Joi.string().required().messages({
    "string.base": "title must be a string",
    "any.required": "title is required",
  }),
  description: Joi.string().required().messages({
    "string.base": "description must be a string",
    "any.required": "description is required",
  }),
  location: Joi.string().required().messages({
    "string.base": "location must be a string",
    "any.required": "location is required",
  }),
  min_salary: Joi.number().optional().messages({
    "number.base": "min_salary must be a number",
  }),
  max_salary: Joi.number().optional().messages({
    "number.base": "max_salary must be a number",
  }),
});


export const updateJobSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional().messages({
    "string.base": "title must be a string",
  }),
  description: Joi.string().optional().messages({
    "string.base": "description must be a string",
  }),
  location: Joi.string().optional().messages({
    "string.base": "location must be a string",
  }),
  min_salary: Joi.number().optional().messages({
    "number.base": "min_salary must be a number",
  }),
  max_salary: Joi.number().optional().messages({
    "number.base": "max_salary must be a number",
  }),
});


export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "id must be a number",
    "number.integer": "id must be an integer",
    "number.positive": "id must be a positive number",
    "any.required": "id parameter is required",
  }),
});