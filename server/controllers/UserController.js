const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '15m' });
  };
  
  const generateRefreshToken = (user) => {
    return jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN);
  };

// register -----------------

const register = async (req, res, next) => {

    const { username, password } = req.body;
    let newUser;

    try {

        // basic validation ---------------------------
        if (!username || !password) {
            return res.status(400).json({ msg: 'Please enter all fields'});
        }

        // validating if existing user ----------------
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hashing password using bcrypt---------------------
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ msg: 'User created successfully', userId: newUser.id});

    } catch (e) {
        res.status(500).json({ e: e.message });
    }

}

const login = async (req, res, next) => {

    const { username, password } = req.body;

    try {

        // basic validation ---------------------------
        if (!username || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        // validating if existing user ----------------
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: "User doesn't exist" });
        }

        // matching password -----------------------------
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.json({ msg: 'Logged in successfully', userId: user.id, accessToken, refreshToken});
    } catch (e) {
        res.status(500).json({ e: e.message });
    }
}

const refreshToken = async (req, res, next) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);
  
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (e, user) => {
      if (e) return res.sendStatus(403);
  
      const accessToken = generateAccessToken({ id: user.userId });
      res.json({ accessToken });
    });
  };

exports.register = register
exports.login = login
exports.refreshToken = refreshToken;