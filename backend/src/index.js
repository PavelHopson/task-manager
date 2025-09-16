import app from './server.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => { // Слушаем на 0.0.0.0 для доступности из Docker/внешне
  console.log(`Server is running on port ${PORT}`);
});