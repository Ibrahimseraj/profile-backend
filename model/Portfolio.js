const mongoose = require("mongoose");
const joi = require("joi");


const portfolioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String
    },
    occupation: {
        type: String
    },
    aboutMe: {
        type: String,
    },
    userImage: {
        type: Object,
        default: {
            url: '',
            public_id: null
        }
    },
    education: [
        {    
            school: {
                type: String
            },
            universitySpecialization: {
                type: String
            }
        }
    ],
    licensesAndCertificates: [
        {
            organization: {
                type: String,
                required: true
            },
            course: {
                type: String,
                required: true
            },
            certificates: {
                type: Object,
                default: {
                    url: '',
                    public_id: null
                }
            }
        }
    ],
    experience: [
        {
            companyName: {
                type: String,
                required: true
            },
            role: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            locationType: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date,
                default: null
            }
        }
    ]
}, {
    timestamps: true
})


const Portfolio = mongoose.model('Portfolio', portfolioSchema);


const validationAddlicensesAndCertificates = (obj) => {
    const schema = joi.object({
      organization: joi.string().trim().required(),
      course: joi.string().trim().required(),
    });
  
    return schema.validate(obj);
};


const addEducationValidation = (obj) => {
    const schema = joi.object({
        school: joi.string().trim().required(),
        universitySpecialization: joi.string().trim().required()
    });

    return schema.validate(obj);
}


const addExperienceValidation = (obj) => {
    const schema = joi.object({
        companyName: joi.string().trim().required(),
        role: joi.string().trim().required(),
        type: joi.string().trim().required(),
        locationType: joi.string().trim().required(),
        description: joi.string().trim().required(),
        from: joi.date().required(),
        to: joi.date().required(),
    });

    return schema.validate(obj);
}


module.exports = { Portfolio, validationAddlicensesAndCertificates, addEducationValidation, addExperienceValidation }