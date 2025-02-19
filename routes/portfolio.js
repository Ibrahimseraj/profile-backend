const router = require("express").Router();
const { getPortfolioCtrl, getSinglePortfolioCtrl, addYourPortfolioCtrl, 
        addEducationCtrl, addExperienceCtrl, addLicensesAndCertificatesCtrl,
        updateEducationCtrl, updateExperienceCtrl, updateLicensesAndCertificatesCtrl, 
        updateAboutMeCtrl, uploadUserImageCtrl, updateNameAndOccupationCtrl,
        deleteEducationCtrl, deleteExperienceCtrl, deletelicensesAndCertificatesCtrl, getEducationCtrl, getExperienceCtrl, getLicensesAndCertificatesCtrl } = require("../controller/portfolioController");
const { verifyToken, verifyTokenAdmin } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
const photoUpload = require("../middlewares/photoUpload");



// route : <| /portfolio/get |>
router.route("/get").get(verifyTokenAdmin, getPortfolioCtrl);


// route : <| /portfolio/get/:id |>
router.route("/get/:id").get(getSinglePortfolioCtrl);


// route : <| /portfolio/:portfolioId/education/:educationId |>
router.route('/:portfolioId/education/:educationId').get(getEducationCtrl);


// route : <| /portfolio/:portfolioId/experience/:experienceId |>
router.route('/:portfolioId/experience/:experienceId').get(getExperienceCtrl);


// route : <| /portfolio/:portfolioId/licenses/certificates/:certificatesId |>
router.route('/:portfolioId/licenses/certificates/:certificatesId').get(getLicensesAndCertificatesCtrl);


// route : <| /portfolio/add/portfolio |>
router.route("/add/portfolio").post(verifyToken, addYourPortfolioCtrl);


// route : <| /portfolio/:id/add/education |>
router.route("/:id/add/education").post(validateObjectId, verifyToken, addEducationCtrl);


// route : <| /portfolio/:id/add/experience |>
router.route("/:id/add/experience").post(validateObjectId, verifyToken, addExperienceCtrl);


// route : <| /portfolio/:id/add/licenses/certificates |>
router.route("/:id/add/licenses/certificates").post(validateObjectId, verifyToken, addLicensesAndCertificatesCtrl);


// route : <| /portfolio/:portfolioId/update/education/:educationId |>
router.route("/:portfolioId/update/education/:educationId").put(verifyToken, updateEducationCtrl);


// route : <| /portfolio/:portfolioId/update/experience/:experienceId |>
router.route("/:portfolioId/update/experience/:experienceId").put(verifyToken, updateExperienceCtrl);


// route : <| /portfolio/:id/update/licenses/certificates/:objId |>
router.route("/:portfolioId/update/licenses/certificates/:objId").put(verifyToken, photoUpload.single("certificates"), updateLicensesAndCertificatesCtrl);


// route : <| /portfolio/:id/update/aboutMe |>
router.route("/:id/update/aboutMe").put(validateObjectId, verifyToken, updateAboutMeCtrl);


// route : <| /portfolio/:id/update/userImage |>
router.route("/:id/update/userImage").post(validateObjectId, verifyToken, photoUpload.single("images"), uploadUserImageCtrl);


// route : <| /portfolio/:id/update/userImage |>
//router.route("/:portfolioId/update/certificate/image/:objId").post(verifyToken, photoUpload.single("certificates"), updateLicensesAndCertificatesImageCtrl);


// route : <| /portfolio/:id/update/name/occupation |>
router.route("/:id/update/name/occupation").put(validateObjectId, verifyToken, updateNameAndOccupationCtrl);


// route : <| /portfolio/:portfolioId/delete/education/:educationId |>
router.route("/:portfolioId/delete/education/:educationId").delete(verifyToken, deleteEducationCtrl);


// route : <| /portfolio/:portfolioId/delete/experience/:experienceId |>
router.route("/:portfolioId/delete/experience/:experienceId").delete(verifyToken, deleteExperienceCtrl);


// route : <| /portfolio/:portfolioId/delete/licensesAndCertificates/:licensesAndCertificatesId |>
router.route("/:portfolioId/delete/licensesAndCertificates/:licensesAndCertificatesId").delete(verifyToken, deletelicensesAndCertificatesCtrl);


module.exports = router;