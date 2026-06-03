import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import csrf from 'csurf';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// Configure CORS for multiple frontend origins
const allowedOrigins = [
  'http://localhost:4173',      // Frontend dev
  'http://localhost:5174',      // Admin dev
  'https://drive-x-frontend-ij61xyxjv-arshhhhdip-4618s-projects.vercel.app',  // Frontend prod
  'https://drive-x-admin-hdumzj335-arshhhhdip-4618s-projects.vercel.app',      // Admin prod
];

app.use(helmet());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(mongoSanitize());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

app.use('/api', routes);
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
app.use(errorHandler);

export default app;
