const userRepo = require("../repositories/userRepository");

const userController = {
    createUser: async (req, res) => {
        const { username, display_name, url_profile, phone, password } = req.body;

        if (!username || !display_name || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
                data: null,
            });
        }

        try {
            const user = await userRepo.createUser({
                username,
                display_name,
                url_profile,
                phone,
                password,
            });

            res.status(201).json({
                success: true,
                message: "Successfully created user",
                data: user,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                data: error.message,
            });
        }
    },

    getAllUser: async (req, res) => {
        try {
            const users = await userRepo.getAllUser();

            res.status(200).json({
                success: true,
                message: "Successfully retrieved users",
                data: users,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                data: error.message,
            });
        }
    },

    getUserById: async (req, res) => {
        try {
            const { user_id } = req.params;

            const user = await userRepo.getUserById(user_id);

            res.status(200).json({
                success: true,
                message: "Successfully retrieved user",
                data: user,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                data: error.message,
            });
        }
    },
};

module.exports = userController;
