import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const jwtSecret = process.env.JWT_SECRET || 'secret';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh';

const createToken = (payload) => jwt.sign(payload, jwtSecret, { expiresIn: '15m' });
const createRefreshToken = (payload) => jwt.sign(payload, refreshSecret, { expiresIn: '7d' });

export async function signup(req, res, next) {
  try {
    const { firstName, lastName, email, password, mobile, country } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ firstName, lastName, email, passwordHash, mobile, country, role: 'customer' });

    const accessToken = createToken({ userId: user._id, role: user.role });
    const refreshToken = createRefreshToken({ userId: user._id, role: user.role });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ user: { id: user._id, email: user.email, role: user.role }, accessToken });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = createToken({ userId: user._id, role: user.role });
    const refreshToken = createRefreshToken({ userId: user._id, role: user.role });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user: { id: user._id, email: user.email, role: user.role }, accessToken });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ error: 'Refresh token missing' });
    }

    const payload = jwt.verify(token, refreshSecret);
    const user = await User.findById(payload.userId);
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const accessToken = createToken({ userId: user._id, role: user.role });
    const newRefreshToken = createRefreshToken({ userId: user._id, role: user.role });

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
}
