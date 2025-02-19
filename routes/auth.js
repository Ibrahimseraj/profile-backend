const router = require("express").Router();
const { registerUserCtrl, loginUserCtrl } = require("../controller/authController");


// route : <| /auth/register |>
router.route("/register").post(registerUserCtrl);


// route : <| /auth/login |>
router.route("/login").post(loginUserCtrl);


module.exports = router;