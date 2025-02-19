const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, registerValidation, loginValidation } = require("../model/User");
const { invalid } = require("joi");




/**
 * @Desc user registeration function
 * @route /auth/register
 * @method POST
 * @access public
 */
module.exports.registerUserCtrl = asyncHandler(
    async (req, res) => {
        const { error } = registerValidation(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        user = new User({
            email: req.body.email,
            password: hashedPassword,
            isAdmin: req.body.isAdmin
        });

        const registeredUser = await user.save();

        res.status(200).json({ message: "you have successfully registered", registeredUser });
    }
);



/**
 * @Desc user login function
 * @route /auth/login
 * @method POST
 * @access public
 */
module.exports.loginUserCtrl = asyncHandler(
    async (req, res) => {
      const { error } = loginValidation(req.body);
  
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      let user = await User.findOne({ email: req.body.email });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password email" });
      }
  
      const isMatchPassword = await bcrypt.compare(req.body.password, user.password);
  
      if (!isMatchPassword) {
        return res.status(400).json({ message: "Invalid email or password password" });
      }
  
      const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.SECERT_CODE);
  
      const { password, ...other } = user._doc;
  
      res.status(200).json({ message: "You have successfully logged in", ...other, token });
    }
);