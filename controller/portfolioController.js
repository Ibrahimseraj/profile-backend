const asyncHandler = require("express-async-handler");
const { Portfolio, validationAddlicensesAndCertificates, addEducationValidation, addExperienceValidation } = require("../model/Portfolio");
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require('../utils/cloudinary');
const moment = require('moment');
const fs = require("fs");
const path = require("path");




/**
 * @Desc get all portfolio
 * @route /portfolio/get
 * @method GET
 * @access private (only admin)
 */
module.exports.getPortfolioCtrl = asyncHandler(
    async (req, res) => {
        const portfolio = await Portfolio.find();

        res.status(200).json(portfolio);
    }
);



/**
 * @Desc get single portfolio
 * @route /portfolio/get/:id
 * @method GET
 * @access public
 */
module.exports.getSinglePortfolioCtrl = asyncHandler(
    async (req, res) => {
        const portfolio = await Portfolio.findById(req.params.id);

        if (!portfolio) {
            return res.status(404).json({ message: "portfolio not found" })
        }

        res.status(200).json(portfolio);
    }
);



/**
 * @Desc get single education
 * @route /portfolio/:portfolioId/education/:educationId
 * @method GET
 * @access public
 */
module.exports.getEducationCtrl = asyncHandler(
    async (req, res) => {
        const portfolio = await Portfolio.findById(req.params.portfolioId);
  
        if (!portfolio) {
        return res.status(404).json({ message: "portfolio not found" });
        }
  
        const educationIndex = portfolio.education.findIndex((item) => item._id.toString() == req.params.educationId);

        if (educationIndex === -1) {
            return res.status(404).json({ message: "licenses and certificates not found" });
        }
  
        const education = portfolio.education[educationIndex];
        res.status(200).json(education);
    }
);



/**
 * @Desc get single experience
 * @route /portfolio/:portfolioId/experience/:experienceId
 * @method GET
 * @access public
 */
module.exports.getExperienceCtrl = asyncHandler(
    async (req, res) => {
        const portfolio = await Portfolio.findById(req.params.portfolioId);
  
        if (!portfolio) {
            return res.status(404).json({ message: "portfolio not found" });
        }
  
        const experienceIndex = portfolio.experience.findIndex((item) => item._id.toString() == req.params.experienceId);

        if (experienceIndex === -1) {
            return res.status(404).json({ message: "licenses and certificates not found" });
        }
  
        const experience = portfolio.experience[experienceIndex];
    
        res.status(200).json(experience);
    }
);



/**
 * @Desc get single licenses certificates
 * @route /portfolio/:portfolioId/licenses/certificates/:certificatesId
 * @method GET
 * @access public
 */
module.exports.getLicensesAndCertificatesCtrl = asyncHandler(
    async (req, res) => {
        const portfolio = await Portfolio.findById(req.params.portfolioId);
  
        if (!portfolio) {
            return res.status(404).json({ message: "portfolio not found" });
        }
  
        const licensesAndCertificatesIndex = portfolio.licensesAndCertificates.findIndex((item) => item._id.toString() == req.params.certificatesId);

        if (licensesAndCertificatesIndex === -1) {
            return res.status(404).json({ message: "licenses and certificates not found" });
        }
  
        const experience = portfolio.licensesAndCertificates[licensesAndCertificatesIndex];
    
        res.status(200).json(experience);
    }
);



/**
 * @Desc post your portfolio
 * @route /portfolio/add/portfolio
 * @method POST
 * @access private (only user himself)
 */
module.exports.addYourPortfolioCtrl = asyncHandler(
    async (req, res) => {
        const existingPortfolio = await Portfolio.findOne({ user: req.user.userId });

        if (existingPortfolio) {
            return res.status(403).json({ message: "You can only have one portfolio" });
        }

        const portfolio = new Portfolio({
            user: req.user.userId,
            name: req.body.name,
            occupation: req.body.occupation,
            aboutMe: req.body.aboutMe,
            userImage: req.body.userImage,
            education: req.body.education,
            licensesAndCertificates: req.body.licensesAndCertificates,
            experience: req.body.experience
        });
  
        const newPortfolio = await portfolio.save();
  
        res.status(201).json(newPortfolio);
    }
);



/**
 * @Desc add education to portfolio
 * @route /portfolio/:id/add/education
 * @method POST
 * @access private (only user himself)
 */
module.exports.addEducationCtrl = asyncHandler(
    async (req, res) => {
        const { error } = addEducationValidation(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        
        const portfolio = await Portfolio.findById(req.params.id);
  
        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }
  
        if (req.user.userId !== portfolio.user.toString()) {
            return res.status(403).json({ message: "You are not allowed" });
        }
  
        const newEducation = {
            school: req.body.school,
            universitySpecialization: req.body.universitySpecialization,
        };
  
        portfolio.education.push(newEducation);
        
        await portfolio.save();
  
        res.status(200).json({ message: "Education added successfully", education: newEducation });
    }
);



/**
 * @Desc add experience to portfolio
 * @route /portfolio/:id/add/experience
 * @method POST
 * @access private (only user himself)
 */
module.exports.addExperienceCtrl = asyncHandler(
    async (req, res) => {
        const { error } = addExperienceValidation(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        
        const portfolio = await Portfolio.findById(req.params.id);
  
        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }
  
        if (req.user.userId !== portfolio.user.toString()) {
            return res.status(403).json({ message: "You are not allowed" });
        }
  
        const newExperience = {
            companyName: req.body.companyName,
            role: req.body.role,
            type: req.body.type,
            locationType: req.body.locationType,
            description: req.body.description,
            from: req.body.from,
            to: req.body.to,
        };

        portfolio.experience.push(newExperience);
        
        const experience = await portfolio.save();
  
        res.status(200).json({ message: "Education added successfully", experience });
    }
);



/**
 * @Desc add licenses and certificates to portfolio
 * @route /portfolio/:id/add/licenses/certificates
 * @method POST
 * @access private (only user himself)
 */
/*
module.exports.addLicensesAndCertificatesCtrl = asyncHandler(
    async (req, res) => {
        //const { error } = validationAddlicensesAndCertificates(req.body);

        //if (error) {
            //return res.status(400).json({ message: error.details[0].message });
        //}

        const portfolio = await Portfolio.findById(req.params.id);
  
        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }
  
        if (req.user.userId !== portfolio.user.toString()) {
            return res.status(403).json({ message: "You are not allowed" });
        }

        const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

        const result = await cloudinaryUploadImage(imagePath);
  
        const newLicensesAndCertificates = {
            organization: req.body.organization,
            course: req.body.course,
            certificates: {
                url: result.secure_url,
                public_id: result.public_id
            }
        };

        portfolio.licensesAndCertificates.push(newLicensesAndCertificates);
        
        await portfolio.save();
  
        res.status(200).json({ message: "Education added successfully", licensesAndCertificates: newLicensesAndCertificates });

        fs.unlinkSync(imagePath);
    }
        post course with certification image to be continued
);

add Licenses And CertificatesCtrl with images
*/

module.exports.addLicensesAndCertificatesCtrl = asyncHandler(
    async (req, res) => {
        try {
            const portfolio = await Portfolio.findById(req.params.id);
  
            if (!portfolio) {
                return res.status(404).json({ message: "Portfolio not found" });
            }
  
            if (req.user.userId !== portfolio.user.toString()) {
                return res.status(403).json({ message: "You are not allowed" });
            }

            // Validate request body
            const { organization, course } = req.body;
            if (!organization || !course) {
                return res.status(400).json({ message: "Organization and course are required" });
            }

            const newLicensesAndCertificates = {
                organization,
                course,
            };

            portfolio.licensesAndCertificates.push(newLicensesAndCertificates);
            
            await portfolio.save();
  
            res.status(200).json({ message: "Education added successfully", licensesAndCertificates: newLicensesAndCertificates });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);
  


/**
 * @Desc post your portfolio
 * @route /portfolio/:id/update/education
 * @method PUT
 * @access private (only user himself)
 */
module.exports.updateEducationCtrl = asyncHandler(async (req, res) => {
    const portfolio = await Portfolio.findById(req.params.portfolioId);

    if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
    }

    if (req.user.userId !== portfolio.user.toString()) {
        return res.status(403).json({ message: "You are not allowed" });
    }

    const updatedEducation = {
        school: req.body.school,
        universitySpecialization: req.body.universitySpecialization,
    };

    const educationIndex = portfolio.education.findIndex(edu => edu._id.toString() === req.params.educationId);

    if (educationIndex === -1) {
        return res.status(404).json({ message: "Education object not found" });
    }

    portfolio.education[educationIndex] = updatedEducation;

    await portfolio.save();

    res.status(200).json({ message: "Education updated successfully", education: portfolio.education });
});



/**
 * @Desc update Experience
 * @route /portfolio/:id/update/experience
 * @method PUT
 * @access private (only user himself)
 */
module.exports.updateExperienceCtrl = asyncHandler(
    async (req, res) => {
        const portfolio = await Portfolio.findById(req.params.portfolioId);

    if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
    }

    if (req.user.userId !== portfolio.user.toString()) {
        return res.status(403).json({ message: "You are not allowed" });
    }

    const updateExperience = {
        companyName: req.body.companyName,
        role: req.body.role,
        type: req.body.type,
        locationType: req.body.locationType,
        description: req.body.description,
        from: moment(req.body.from).toDate(),
        to: req.body.to ? moment(req.body.to).toDate() : null,
    };

    const experienceIndex = portfolio.experience.findIndex(exp => exp._id.toString() === req.params.experienceId);

    if (experienceIndex === -1) {
        return res.status(404).json({ message: "Education object not found" });
    }

    portfolio.experience[experienceIndex] = updateExperience;

    const experience = await portfolio.save();

    res.status(200).json({ message: "Education updated successfully", experience });
    }
);



/**
 * @Desc update Experience
 * @route /portfolio/:id/update/licenses/certificates
 * @method PUT
 * @access private (only user himself)
 */
module.exports.updateLicensesAndCertificatesCtrl = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.portfolioId);

  if (!portfolio) {
    return res.status(404).json({ message: "portfolio not found" });
  }

  if (req.user.userId !== portfolio.user.toString()) {
    return res.status(403).json({ message: "you are not allowed, only the user himself has access" });
  }

  const licensesAndCertificatesIndex = portfolio.licensesAndCertificates.findIndex((item) => item._id.toString() === req.params.objId);

  if (licensesAndCertificatesIndex === -1) {
    return res.status(404).json({ message: "licenses and certificates not found" });
  }

  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  if (portfolio.licensesAndCertificates[licensesAndCertificatesIndex].certificates.public_id !== null) {
    await cloudinaryRemoveImage(portfolio.licensesAndCertificates[licensesAndCertificatesIndex].certificates.public_id);
  }

  portfolio.licensesAndCertificates[licensesAndCertificatesIndex].organization = req.body.organization;
  portfolio.licensesAndCertificates[licensesAndCertificatesIndex].course = req.body.course;
  portfolio.licensesAndCertificates[licensesAndCertificatesIndex].certificates.url = result.secure_url;
  portfolio.licensesAndCertificates[licensesAndCertificatesIndex].certificates.public_id = result.public_id;

  portfolio.markModified('licensesAndCertificates');

  const updatedPortfolio = await portfolio.save();

  res.status(200).json({ message: "updated successfully", updatedPortfolio });

  fs.unlinkSync(imagePath);
});



/**
 * @Desc update Experience
 * @route /portfolio/:id/update/aboutMe
 * @method PUT
 * @access private (only user himself)
 */
module.exports.updateAboutMeCtrl = asyncHandler(
    async (req, res) => {
        const portfolio = await Portfolio.findById(req.params.id);

        if (!portfolio) {
            return res.status(404).json({ message: "portfolio not found" });
        }

        if (req.user.userId !== portfolio.user.toString()) {
            return res.status(403).json({ message: "you are not allowed, only user himself have the access" });
        }

        const aboutMe = await Portfolio.findByIdAndUpdate(req.params.id, {
            $set: {
                aboutMe: req.body.aboutMe
            }
        }, { new: true });

        res.status(200).json({ message: "about me successfully updated", aboutMe });
    }
);



/**
 * @Desc update Experience
 * @route /portfolio/:id/update/userImage
 * @method POST
 * @access private (only user himself)
 */
module.exports.uploadUserImageCtrl = asyncHandler(
    async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: "no file provided" });
        }

        const portfolio = await Portfolio.findById(req.params.id);

        if (!portfolio) {
            return res.status(404).json({ message: "portfolio not found" });
        }

        if (req.user.userId !== portfolio.user.toString()) {
            return res.status(403).json({ message: "you are not allowed, only user himself have the access" });
        }

        const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

        const result = await cloudinaryUploadImage(imagePath);

        if (portfolio.userImage.public_id !== null) {
            await cloudinaryRemoveImage(portfolio.userImage.public_id);
        }

        portfolio.userImage = {
            url: result.secure_url,
            public_id: result.public_id
        };


        await portfolio.save();

        res.status(200).json({ message: "userImage successfully updated", profilePhoto: { url: result.secure_url, public_id: result.public_id } });

        fs.unlinkSync(imagePath);
    }
);



/**
 * @Desc update Experience
 * @route /portfolio/:id/update/name/occupation
 * @method POST
 * @access private (only user himself)
 */
module.exports.updateNameAndOccupationCtrl = asyncHandler(
    async (req, res) => {
        const portfolio = await Portfolio.findById(req.params.id);

        if (!portfolio) {
            return res.status(404).json({ message: "portfolio not found" });
        }

        if (req.user.userId !== portfolio.user.toString()) {
            return res.status(403).json({ message: "you are not allowed, only user himself have the access" });
        }

        const nameAndOccupation = await Portfolio.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                occupation: req.body.occupation
            }
        }, { new: true });

        res.status(200).json({ message: "userImage successfully updated", nameAndOccupation });
    }
);



/**
 * @Desc delete single education
 * @route /portfolio/:id/delete/education/educationId
 * @method DELETE
 * @access private (only user himself)
 */
module.exports.deleteEducationCtrl = asyncHandler(
    async (req, res) => {
        const { portfolioId, educationId } = req.params;

        const portfolio = await Portfolio.findById(portfolioId);

        if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
        }

        if (req.user.userId !== portfolio.user.toString()) {
        return res.status(403).json({ message: "Only the owner can delete the education" });
        }

        const educationIndex = portfolio.education.findIndex(edu => edu._id.toString() === educationId);

        if (educationIndex === -1) {
        return res.status(404).json({ message: "Education not found" });
        }

        const deletedEducation = portfolio.education.splice(educationIndex, 1)[0];
        await portfolio.save();

        return res.status(200).json({ message: "Education successfully deleted", deletedEducation });
    }
);



/**
 * @Desc delete single experience
 * @route /portfolio/:id/delete/experience/:experienceId
 * @method DELETE
 * @access private (only user himself)
 */
module.exports.deleteExperienceCtrl = asyncHandler(
    async (req, res) => {
        const { portfolioId, experienceId } = req.params;

        const portfolio = await Portfolio.findById(portfolioId);

        if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
        }

        if (req.user.userId !== portfolio.user.toString()) {
            return res.status(403).json({ message: "Only the owner can delete the education" });
        }

        const experienceIndex = portfolio.experience.findIndex(edu => edu._id.toString() === experienceId);

        if (experienceIndex === -1) {
        return res.status(404).json({ message: "Experience not found" });
        }

        const deletedExperience = portfolio.experience.splice(experienceIndex, 1)[0];
        await portfolio.save();

        return res.status(200).json({ message: "Education successfully deleted", deletedExperience });
    }
);



/**
 * @Desc delete single licensesAndCertificates1
 * @route /portfolio/:id/delete/licensesAndCertificates/:licensesAndCertificatesId
 * @method DELETE
 * @access private (only user himself)
 */
module.exports.deletelicensesAndCertificatesCtrl = asyncHandler(
    async (req, res) => {
        const { portfolioId, licensesAndCertificatesId } = req.params;

        const portfolio = await Portfolio.findById(portfolioId);

        if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
        }

        if (req.user.userId !== portfolio.user.toString()) {
        return res.status(403).json({ message: "Only the owner can delete the education" });
        }

        const licensesAndCertificatesIndex = portfolio.licensesAndCertificates.findIndex(edu => edu._id.toString() === licensesAndCertificatesId);

        if (licensesAndCertificatesIndex === -1) {
            return res.status(404).json({ message: "Experience not found" });
        }

        const licensesAndCertificates = portfolio.licensesAndCertificates[licensesAndCertificatesIndex];

        if (licensesAndCertificates.certificates.public_id !== null) {
            await cloudinaryRemoveImage(licensesAndCertificates.certificates.public_id);
        }

        const deletedLicensesAndCertificates = portfolio.licensesAndCertificates.splice(licensesAndCertificatesIndex, 1)[0];
        await portfolio.save();

        return res.status(200).json({ message: "Education successfully deleted", deletedLicensesAndCertificates });
    }
);



/**
 * @Desc delete portfolio
 * @route /portfolio/:id/delete/porfolio
 * @method DELETE
 * @access private (only user himself and admin)
 */
module.exports.deletePortfolioCtrl = asyncHandler(
    async (req, res) => {
        const porfolio = req.params.id;
        const portfolioId = await Portfolio.findById(porfolio);

        if (!portfolioId) {
            return res.status(404).json({ message: "portfolio not found" });
        }

        if (req.user.userId || req.user.isAdmin !== portfolioId.user.toString()) {
            return res.status(400).json({ message: "Only the owner can delete the portfolio" });
        }

        if (portfolioId.userImage.public_id !== null) {
            await cloudinaryRemoveImage(portfolioId.userImage.public_id);
        }

        await Portfolio.findByIdAndDelete(porfolio);

        res.status(200).json({ message: "your portfolio has been deleted successfully" })
    }
);