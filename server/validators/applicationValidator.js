import Joi from "joi";

export const applicationSchema = Joi.object({
  job_id: Joi.number().integer().positive().required().messages({
    "number.base": "job_id must be a number",
    "number.integer": "job_id must be an integer",
    "number.positive": "job_id must be a positive number",
    "any.required": "job_id is required",
  }),
  cover_letter: Joi.string().max(2000).allow("").messages({
    "string.base": "cover_letter must be a string",
    "string.max": "cover_letter cannot exceed 2000 characters",
  }),
  cv_link: Joi.string().uri().required().messages({
    "string.uri": "cv_link must be a valid URL",
    "any.required": "cv_link is required",
  }),
});
