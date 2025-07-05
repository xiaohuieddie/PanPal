import Joi from 'joi';
import { SignUpRequest, SignInRequest } from '../types';

export const signUpSchema = Joi.object<SignUpRequest>({
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  wechatId: Joi.string().optional(),
  wechatToken: Joi.string().optional(),
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
}).custom((value: any, helpers: any) => {
  // Either email/password or wechatId/wechatToken must be provided
  const hasEmailPassword = value.email && value.password;
  const hasWeChat = value.wechatId && value.wechatToken;
  
  if (!hasEmailPassword && !hasWeChat) {
    return helpers.error('any.invalid', { 
      message: 'Either email/password or wechatId/wechatToken must be provided' 
    });
  }
  
  return value;
});

export const signInSchema = Joi.object<SignInRequest>({
  email: Joi.string().email().optional(),
  password: Joi.string().optional(),
  wechatId: Joi.string().optional(),
  wechatToken: Joi.string().optional(),
}).custom((value: any, helpers: any) => {
  // Either email/password or wechatId/wechatToken must be provided
  const hasEmailPassword = value.email && value.password;
  const hasWeChat = value.wechatId && value.wechatToken;
  
  if (!hasEmailPassword && !hasWeChat) {
    return helpers.error('any.invalid', { 
      message: 'Either email/password or wechatId/wechatToken must be provided' 
    });
  }
  
  return value;
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  age: Joi.number().integer().min(13).max(120).optional(),
  gender: Joi.string().valid('male', 'female').optional(),
  height: Joi.number().min(100).max(250).optional(),
  weight: Joi.number().min(30).max(300).optional(),
  bodyFat: Joi.number().min(5).max(50).optional(),
  goal: Joi.string().valid('lose_fat', 'gain_muscle', 'control_sugar', 'maintain').optional(),
  cuisinePreferences: Joi.array().items(Joi.string()).min(1).optional(),
  allergies: Joi.array().items(Joi.string()).optional(),
  dislikes: Joi.array().items(Joi.string()).optional(),
  cookingTime: Joi.string().valid('<15', '15-30', '>30').optional(),
  budget: Joi.string().valid('economic', 'standard', 'premium').optional(),
}); 