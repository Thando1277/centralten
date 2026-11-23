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

const login = async (req, res) => {
    try{
        const { email, password} = req.body || {};

        const userData = {
            email,
            password
        }

        const validationError = authValidator.validateLogin(userData);

        if(validationError){
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const normalizedUserData = {
            email: email.trim().toLowerCase(),
            password
        }

        const data = await authService.login(normalizedUserData);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: {
                id: data.user.id,
                email: data.user.email
            },
            sesion: {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                expires_at: data.session.expires_at
            }
        });

    }
    catch(error){
        console.error("Login error, ", error);

        if(error.code == "invalid_credentials"){
            return res.status(401).json({
                success: false,
                message: "Incorrect email or password."
            });
        }

        if(error.code == "email_not_confrimed"){
            return res.status(403).json({
                success: false,
                message: "Please verify your email address before logging in"
            })
        }

        return res.status(500).json({
            success: false,
            message: "An unexpected error occured."
        })
    }
}

const getProfile = async (req, res) => {
    try{
        const userId = req.user.id;

        const profile = await authService.getUserProfile(userId, req.accessToken);

        return res.status(200).json({
            success: true,
            message: "Profile retreived successfully",
            user: profile
        });

    }catch(error){
        console.error("Get profile error, ", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retreive user profile."
        });
    }
};

module.exports = {
    signup,
    login,
    getProfile
};