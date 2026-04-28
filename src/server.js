import express from 'express';
import morgan from 'morgan';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUI from 'swagger-ui-express';
import yaml from 'js-yaml';

import authRoutes from './routes/authRoutes.js';
import ideasRoutes from './routes/ideasRoutes.js';
import projectsRoutes from './routes/projectsRoutes.js';
import materialsRoutes from './routes/materialsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));
app.get('/', (req, res) => res.status(200).send('API is running...\nVisit https://idea-tracker-api.onrender.com/api-docs for API documentation'));
if (process.env.NODE_ENV !== 'test') app.use(morgan('tiny'));

let specs;
try {
  const yamlPath = path.join(__dirname, '..', 'docs', 'openapi.yaml');
  specs = yaml.load(fs.readFileSync(yamlPath, 'utf8'));
} catch (error) {
  console.log('Failed to load OpenAPI specification', error);
  process.exit(1);
}

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideasRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/materials', materialsRoutes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File size cannot exceed 10MB',
    });
  }
  console.log(err.stack);
  if (!err.status) {
    err.status = 500;
    err.message = 'Internal Server Error';
  }
  res.status(err.status).json({ error: err.message });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

export default app;
