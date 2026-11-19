const { signup } = require("../services/auth.service");

const validateSignup = (userData) => {

    if(!userData || typeof userData !== "object" || Array.isArray(userData)){
        return "Invalid registration data.";
    }

    const { full_name, email, password, phone_number, role} = userData;

    if(!full_name || !email || !password || !role){
        return "Please provide all required fields."
    }

    if(typeof full_name !== "string" || full_name.trim().length < 2){
        return "Full name must contain at least 2 characters."
    }

    //Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (typeof email !== "string" || !emailRegex.test(email.trim())) {
        return "Please provide a valid email address.";
    }

    //Validate password
    if(typeof password !== "string" || password.length < 8){
        return "Password must contain at least 8 characters."
    }

    //Validate phone number
    if(
        phone_number !== "undefined" &&
        phone_number !== null &&
        phone_number !== "" &&
        (typeof phone_number !== "string" || !/^\+?[0-9]{10,15}$/.test(phone_number))
    ){
        return "Please provide a valid phone number."
    }

    //Validate role
    if(!["landlord", "tenant"].includes(role)){
        return "Invalid role.";
    }

    return null;
};

//Validate login
const validateLogin = (userData) => {
    if(!userData || typeof userData !== "object" || Array.isArray(userData)){
        return "Invalid login data";
    }

    const { email, password} = userData;

    if(!email || !password){
        "Please provide your email and password."
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(typeof email !== "string" || !emailRegex.test(email.trim())){
        return "Please provide a valid email address."
    }

    if(typeof password !== "string" || password.length < 8){
        return "Invalid email or password"
    }

    return null;
}

module.exports = {
    validateSignup,
    validateLogin
}