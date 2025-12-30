const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "Title is required",
    }),

    description: Joi.string().required().messages({
      "string.empty": "Description is required",
    }),

    price: Joi.number().required().min(0).messages({
      "number.base": "Price must be a number",
      "number.min": "Price must be greater than or equal to 0",
    }),

    location: Joi.string().required().messages({
      "string.empty": "Location is required",
    }),

    country: Joi.string().required().messages({
      "string.empty": "Country is required",
    }),

    image: Joi.string().allow("", null),
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
  }).required(),
});


module.exports = { listingSchema, reviewSchema};

