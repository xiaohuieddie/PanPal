import Joi from 'joi';

export const generateMealPlanSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().min(2).max(50).required(),
  age: Joi.number().integer().min(13).max(120).required(),
  gender: Joi.string().valid('male', 'female').required(),
  height: Joi.number().min(100).max(250).required(),
  weight: Joi.number().min(30).max(300).required(),
  bodyFat: Joi.number().min(5).max(50).optional(),
  goal: Joi.string().valid('lose_fat', 'gain_muscle', 'control_sugar', 'maintain').required(),
  cuisinePreferences: Joi.array().items(Joi.string()).min(1).required(),
  allergies: Joi.array().items(Joi.string()).default([]),
  dislikes: Joi.array().items(Joi.string()).default([]),
  cookingTime: Joi.string().valid('<15', '15-30', '>30').required(),
  budget: Joi.string().valid('economic', 'standard', 'premium').required(),
}); 