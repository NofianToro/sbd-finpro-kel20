const userRepo = require("../repositories/userRepository");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const userController = {
    createUser: async (req, res) => {
        try {
            const { username, display_name, url_profile, phone, password } = req.body;

            const existingUser = await userRepo.getUserByUsername(username);

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Username already exists",
                    data: null,
                });
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = await userRepo.createUser({
                username,
                display_name,
                url_profile,
                phone,
                password: hashedPassword,
            });

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: user,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                data: null,
            });
        }
    },

    loginUser: async (req, res) => {
        try {
            const { username, password } = req.body;

            const user = await userRepo.getUserByUsername(username);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid username or password",
                    data: null,
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid username or password",
                    data: null,
                });
            }

            const token = jwt.sign(
                {
                    user_id: user.user_id,
                    username: user.username,
                    role: 'user',
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h",
                },
            );

            res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    token,
                    user: {
                        user_id: user.user_id,
                        username: user.username,
                        display_name: user.display_name,
                        phone: user.phone,
                        saldo: user.saldo,
                    },
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                data: null,
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

    getUserByUserId: async (req, res) => {
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
    getProfile: async (req, res) => {
        try {
            const user_id = req.user.user_id; 
            const user = await userRepo.getUserById(user_id);

            res.status(200).json({
                success: true,
                message: "Successfully retrieved profile",
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
    userTopUpSaldo: async (req, res) => {
        try {
            const { user_id } = req.params;
            const { saldo } = req.body;
            const saldoAmount = Number(saldo);

            const result  = await userRepo.updateSaldo(user_id, saldoAmount);

            res.status(200).json({
                success: true,
                message: "Successfully update saldo",
                data: result,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                data: error.message,
            });
        }
    }
};

module.exports = userController;
