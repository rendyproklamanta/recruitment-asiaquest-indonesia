
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });

  return res.json(
    {
      status: true,
      message: 'Successfully create user',
      data: { id: user.id, email: user.email }
    }
  );
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  const match = await bcrypt.compare(password, user.password);

  if (!user || !match) {
    return res.status(401).json({ status: false, message: 'Email or password invalid' })
  }

  const accessToken = jwt.sign(
    {
      id: user.id
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  // Store refresh token in DB
  await user.update({ refreshToken });

  return res.json({
    user: { id: user.id, email: user.email },
    accessToken,
    refreshToken
  });
};

exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: 'Refresh token required' });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ status: false, message: 'Invalid refresh token' });
    }

    // Issue new access token
    const accessToken = jwt.sign(
      {
        id: user.id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
    );

    return res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

exports.logout = async (req, res) => {
  const user = await User.findByPk(req.userId);
  if (user) await user.update({ refreshToken: null });

  return res.json(
    {
      status: true,
      message: 'Successfully Logged out',
    }
  );
};