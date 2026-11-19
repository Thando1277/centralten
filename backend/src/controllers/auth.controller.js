const authService = require("../services/auth.service");
const authValidator = require("../validators/auth.validator");

const signup = async (req, res) => {
    try{
        const { full_name, email, password, phone_number, role} = req.body;

        const userData = {
            full_name,
            email,
            password,
            phone_number,
            role
        }

        const validationError = authValidator.validateSignup(userData);

        if(validationError){
            return res.status(400).json({
                success: false,
                message: validationError
            })
        }

        const normalizedUserData = {
            ...userData,
            full_name: full_name.trim(),
            email: email.trim().toLowerCase(),
            phone_number: phone_number?.trim() || null
        }

        const data = await authService.signup(normalizedUserData);

        return res.status(201).json({
            success: true,
            message: "Registration successful. Please check email to verify your account.",
            user: {
                id: data.user.id,
                email: data.user.email,
                full_name: data.user.full_name,
                role: data.user.user_metadata.role
            }
        });


    }catch(error){
        console.error("Signup error: ", error);

        if(error.code === "user already exists"){
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            })
        }

        if(error.code === "over_email_send_rate_limit"){
            return res.status(429).json({
                success: false,
                message: "Too many registration attempts. Please wait before trying again."
            });
        }

        return res.status(500).json({
            success: false,
            message: "An unexpected error occured"
        });
    }
}

module.exports = {signup};