const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '24h' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );

  return { accessToken, refreshToken };
};

const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await req.app.get('db').models.User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create user
    const user = await req.app.get('db').models.User.create({
      fullName,
      email: email.toLowerCase(),
      password,
      role: 'student',
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    logger.info(`User registered: ${email}`);

    res.status(201).json({
      message: 'Registration successful',
      user: user.toJSON(),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error('Registration error:', error.message);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await req.app.get('db').models.User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    logger.info(`User logged in: ${email}`);

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await req.app.get('db').models.User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(
      user.id,
      user.role
    );

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    logger.error('Token refresh error:', error.message);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await req.app.get('db').models.User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.toJSON());
  } catch (error) {
    logger.error('Get user error:', error.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

module.exports = { register, login, refreshToken, getMe };
