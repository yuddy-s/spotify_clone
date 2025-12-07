const auth = require('../auth');
const bcrypt = require('bcryptjs');
const db = require("../db");


getLoggedIn = async (req, res) => {
    try {
        const userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(200).json({
                loggedIn: false,
                user: null
            });
        }

        const loggedInUser = await db.findById('User', userId);
        if (!loggedInUser) {
            return res.status(404).json({ loggedIn: false, user: null });
        }

        return res.status(200).json({
            loggedIn: true,
            user: {
                userName: loggedInUser.userName,
                email: loggedInUser.email,
                avatar: loggedInUser.avatar
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ loggedIn: false, user: null });
    }
};

registerUser = async (req, res) => {
    try {
        const { userName, email, password, passwordVerify, avatar } = req.body;

        if (!userName || !email || !password || !passwordVerify || !avatar) {
            return res.status(400).json({ errorMessage: "Please enter all required fields." });
        }

        if (password.length < 8) {
            return res.status(400).json({ errorMessage: "Password must be at least 8 characters." });
        }

        if (password !== passwordVerify) {
            return res.status(400).json({ errorMessage: "Passwords do not match." });
        }

        const existingUser = await db.findOne('User', { email });
        if (existingUser) {
            return res.status(400).json({ errorMessage: "An account with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await db.create('User', 
            { 
                userName, 
                email, 
                passwordHash, 
                avatar, 
                playlists: [] 
            });

        const token = auth.signToken(newUser._id);

        return res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                _id: newUser._id,
                userName: newUser.userName,
                email: newUser.email,
                avatar: newUser.avatar
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ errorMessage: "Server error during registration." });
    }
};


loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ errorMessage: "Please enter all required fields." });
        }

        const user = await db.findOne('User', { email });
        if (!user) {
            return res.status(401).json({ errorMessage: "Wrong email or password." });
        }

        const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
        if (!passwordCorrect) {
            return res.status(401).json({ errorMessage: "Wrong email or password." });
        }

        const token = auth.signToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                userName: user.userName,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errorMessage: "Server error during login." });
    }
};

logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).status(200).json({ success: true });
};

editAccount = async (req, res) => {
    try {
        const userId = auth.verifyUser(req);
        if (!userId) return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });

        const { userName, email, password, passwordVerify, avatar } = req.body;
        if (!userName && !email && !password && !avatar) {
            return res.status(400).json({ errorMessage: "Nothing to update." });
        }

        const user = await db.findById('User', userId);
        if (!user) return res.status(404).json({ errorMessage: "User not found." });

        if (email && email !== user.email) {
            const existingEmail = await db.findOne('User', { email });
            if (existingEmail) {
                return res.status(400).json({ errorMessage: "Email already in use." });
            }
            user.email = email;
        }

        if (userName && userName !== user.userName) {
            const existingUserName = await db.findOne('User', { userName });
            if (existingUserName) {
                return res.status(400).json({ errorMessage: "Username already in use." });
            }
            user.userName = userName;
        }

        if (password) {
            if (password.length < 8) {
                return res.status(400).json({ errorMessage: "Password must be at least 8 characters." });
            }
            if (password !== passwordVerify) {
                return res.status(400).json({ errorMessage: "Passwords do not match." });
            }
            const salt = await require('bcryptjs').genSalt(10);
            user.passwordHash = await require('bcryptjs').hash(password, salt);
        }

        if (avatar !== undefined) user.avatar = avatar;

        await db.update('User', { _id: userId }, {
            userName: user.userName,
            email: user.email,
            passwordHash: user.passwordHash,
            avatar: user.avatar
        });

        return res.status(200).json({
            success: true,
            user: {
                userName: user.userName,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: "Failed to update account." });
    }
};

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    editAccount
};
