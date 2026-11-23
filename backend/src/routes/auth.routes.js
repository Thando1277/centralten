const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");
const { authenticateUser } = require("../middleware/auth.middleware");
const { loadUserProfile } = require("../middleware/profile.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");


router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/profile", authenticateUser, authController.getProfile);

router.get(
    "/landlord-dashboard",
    authenticateUser,
    loadUserProfile,
    authorizeRoles("landlord"),
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Welcome to the landlord dashboard."
        });
    }
)

module.exports = router;