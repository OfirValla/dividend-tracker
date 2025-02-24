import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

import sequelize from './db';
import stocksRouter from './routes/stocks';

dotenv.config();

const app = express();
app.use(express.json());

// Serve React static files
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.use(stocksRouter);

// Sync DB and Start Server
const PORT = process.env.PORT || 3001;
sequelize.sync().then(() => {
    console.log('? Database synced');
    app.listen(PORT, () => console.log(`?? Server running on port ${PORT}`));
});
