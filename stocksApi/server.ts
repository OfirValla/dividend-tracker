import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import sequelize from './db';
import Stock from './models/Stock';
import Dividend from './models/Dividend';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

// Serve React static files
app.use(express.static(path.join(__dirname, '../frontend/build')));

// ? Get all stocks
app.get('/stocks', async (req: Request, res: Response) => {
    const stocks = await Stock.findAll();
    res.json(stocks);
});

// ? Get dividends for a stock
app.get('/stocks/:stockId/dividends', async (req: Request, res: Response) => {
    const { stockId } = req.params;
    const dividends = await Dividend.findAll({ where: { stock_id: stockId } });
    res.json(dividends);
});

// ? Add a new stock
app.post('/stocks', async (req: Request, res: Response) => {
    const { symbol, userAmount } = req.body;
    const newStock = await Stock.create({ symbol, userAmount });
    res.status(201).json(newStock);
});

// ? Add a dividend to a stock
app.post('/stocks/:stockId/dividends', async (req: Request, res: Response) => {
    const { stockId } = req.params;
    const { exDate, recordDate, payDate, amount, amount_announced } = req.body;

    const newDividend = await Dividend.create({
        stock_id: stockId,
        exDate,
        recordDate,
        payDate,
        amount,
        amount_announced,
    });

    res.status(201).json(newDividend);
});

// ? Update a dividend
app.put('/stocks/:stockId/dividends', async (req: Request, res: Response) => {
    const { stockId } = req.params;
    const { dividend_id, ...updateFields } = req.body;

    await Dividend.update(updateFields, { where: { dividend_id, stock_id: stockId } });
    res.json({ message: 'Dividend updated successfully' });
});

// ? Delete a stock
app.delete('/stocks/:stockId', async (req: Request, res: Response) => {
    const { stockId } = req.params;
    await Stock.destroy({ where: { id: stockId } });
    res.json({ message: 'Stock deleted' });
});

// Sync DB and Start Server
const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => {
    console.log('? Database synced');
    app.listen(PORT, () => console.log(`?? Server running on port ${PORT}`));
});
