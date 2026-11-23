const {supabase} = require("../config/database");

const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access token is required."
            });
        }

        const token = authHeader.split(" ")[1];

        if (!authHeader.startsWith("Bearer ") || !token) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization header."
            });
        }

        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired access token."
            });
        }

        req.user = data.user;
        req.accessToken = token

        next();

    } catch (error) {
        console.error("Authentication middleware error, ", error);

        return res.status(500).json({
            success: false,
            message: "An unexpected authentication error occurred."
        });
    }
}

module.exports = {
    authenticateUser
};