const db = require('../../models');
const bcrypt = require('bcrypt');
const { Validator } = require('node-input-validator');
const helper = require('../../helper/helper');

const userValidationSchema = {
    email: 'required|email',
    role: 'required|string',
    password: 'required|string|minLength:6',
};

module.exports = {
    createUser: async (req, res) => {
        try {
            const { email, password, role, name, address, phone_number, country_code, otp, is_verfied } = req.body;
    
            const v = new Validator(req.body, userValidationSchema);
            const matched = await v.check();
            if (!matched) {
                return res.status(422).json({ message: "Validation failed", errors: v.errors });
            }
            let imagePath = null;
            if (req.files && req.files.image) {
                imagePath = await helper.fileUpload(req.files.image);
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const find_user = await db.users.findOne({ where: { email } });
            if (find_user) {
                return res.status(400).json({ message: "User already exists" });
            }
            const full_phone_number = `${country_code}-${phone_number}`;
            const newUser = await db.users.create({
                role,
                email,
                password: hashedPassword,
                name,
                address,
                phone_number: full_phone_number,
                country_code,
                otp,
                is_verfied,
                image: imagePath
            });
    
            return res.status(201).json({ message: "User created successfully", data: newUser });
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(500).json({ message: "Error creating user", error: error.message });
        }
    },
    
    get: async (req, res) => {
        try {
            const user = await db.users.findAll({ where: { email: req.body.email } });

            if (!user || user.length === 0) {
                return res.status(404).json({ message: "User not found." });
            }

            res.json(user);
        } catch (error) {
            console.error("Error finding user:", error);
            res.status(500).json({ message: "Error finding user", error: error.message });
        }
    },   
};
