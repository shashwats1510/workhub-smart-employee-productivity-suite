import Joi from "joi";
import jwt from "jsonwebtoken";

export const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/^(?=.*[a-zA-Z])(?=.*[\d\W]).{10,}$/)
      .message(
        "Password must be at least 10 characters long and contain at least one letter and one number or special character.",
      )
      .required(),
    name: Joi.string().required(),
    post: Joi.string().valid("Admin", "Manager", "Employee").required(),
    phoneNo: Joi.string().required(),
    dob: Joi.date().iso().required(),
    role: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    // Returning a cleaner error message format for the frontend
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json(error);

  next();
};

export const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;
  if (token)
    jwt.verify(token, process.env.JWT_SECRET, {}, (error, info) => {
      if (error) res.status(500).json("Internal server error");
      else next();
    });
  else res.status(401).json({ redired_url: "http://localhost:3000/login" });
};
