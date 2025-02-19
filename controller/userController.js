const asyncHandler = require("express-async-handler");
const { User } = require("../model/User");
const { Portfolio } = require("../model/Portfolio");



/**
 * @Desc get all users
 * @route /user/get
 * @method GET
 * @access private (only admin) 
 */
module.exports.getAllUsersCtrl = asyncHandler(
    async (req, res) => {
        const users = await User.find().select("-password");

        res.status(200).json(users);
    }
);



/**
 * @Desc get a single user by id
 * @route /user/:id/get
 * @method GET
 * @public
 */
module.exports.getSingleUserCtrl = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.params.id).select("-password");

        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ message: "user not found" });
        }
    }
);



/**
 * @Desc get a single user by id
 * @route /user/:id/portfolio
 * @method GET
 * @public (only user himself)
 */
module.exports.getYourPortfolioCtrl = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.user.userId).select("-password");
        const portfolio = await Portfolio.findOne({ user: user });

        res.status(200).json(portfolio);
    }
);



/**
 * @Desc delete user
 * @route /user/:id/delete
 * @method DELETE
 * @access private (only user himself or admin)
 */
module.exports.deleteUserCtrl = asyncHandler(
    async (req, res) => {
        const userId = await User.findById(req.params.id).select("-password");
        const user = await User.findOne(userId).select("-password");


        if (user) {
            await User.findByIdAndDelete(user);
            return res.status(200).json({ message: "user successfully loged out" });
        } else {
            return res.status(404).json({ message: "user not found" });
        }
    }
);