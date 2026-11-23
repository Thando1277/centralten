const authService = require("../services/auth.service");

const loadUserProfile = async (req, res, next) => {
    try{
        const userId = req.user.id;

        const profile = await authService.getUserProfile(userId, req.accessToken);

        if(!profile){
            return res.status(404).json({
                success: false,
                message: "User profile not found."
            });
        }

        if(!profile.is_active){
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated."
            });
        }

        req.profile = profile;

        next();

    }catch(error){
        console.error("Profile middleware error, ", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load user profile."
        });
    }
}

module.exports = {
    loadUserProfile
}