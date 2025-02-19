const router = require("express").Router();
const { getAllUsersCtrl, getSingleUserCtrl, getYourPortfolioCtrl, deleteUserCtrl } = require("../controller/userController");
const { verifyToken, verifyTokenAdmin, verifyTokenAuthorization } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");



// route : <| /user/get |>
router.route("/get").get(verifyTokenAdmin, getAllUsersCtrl);


// route : <| /user/:id/get |>
router.route("/:id/get").get(validateObjectId, getSingleUserCtrl);


// route : <| /user/portfolio |>
router.route("/profile").get(verifyToken, getYourPortfolioCtrl);


// route : <| /user/:id/delete |>
router.route("/:id/delete").delete(validateObjectId, verifyTokenAuthorization, deleteUserCtrl)


module.exports = router;