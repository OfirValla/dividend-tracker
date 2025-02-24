import express, { Request, Response } from 'express';
import Stock from '../models/Stock';  
import Dividend from '../models/Dividend';  

const router = express.Router();

// ✅ Get all stocks
router.get('/stocks', async (req: Request, res: Response) => {
    const stocks = await Stock.findAll();
    res.json(stocks);
});

// ✅ Get dividends for a stock
router.get('/stocks/:stockId/dividends', async (req: Request, res: Response) => {
    const { stockId } = req.params;
    const dividends = await Dividend.findAll({
        where: { stock_id: stockId },
        order: [['dividend_id', 'ASC']]
    });
    res.json(dividends);
});

// ✅ Add a new stock
router.post('/stocks', async (req: Request, res: Response) => {
    const { symbol, userAmount } = req.body;
    const newStock = await Stock.create({ symbol, userAmount });
    res.status(201).json(newStock);
});

// ✅ Add a dividend to a stock
router.post('/stocks/:stockId/dividends', async (req: Request, res: Response) => {
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

// ✅ Update the amount for a stock symbol
router.put('/stocks/:stockId/amount', async (req: Request, res: Response) => {
    const { stockId } = req.params;
    const { amount } = req.body;

    if (amount === undefined || amount <= 0) {
        res.status(400).json({ error: 'Invalid user amount' });
        return;
    }

    try {
        // Find the stock
        const stock = await Stock.findByPk(stockId);

        if (!stock) {
            res.status(404).json({ error: 'Stock not found' });
            return;
        }

        // Update the user amount
        stock.amount = amount;
        await stock.save();

        res.status(200).json({ message: 'Stock amount updated successfully', stock });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ✅ Update a dividend
router.put('/stocks/:stockId/dividends', async (req: Request, res: Response) => {
    const { stockId } = req.params;
    const { dividend_id, ...updateFields } = req.body;

    await Dividend.update(updateFields, { where: { dividend_id, stock_id: stockId } });
    res.json({ message: 'Dividend updated successfully' });
});

// ✅ Delete a stock
router.delete('/stocks/:stockId', async (req: Request, res: Response) => {
    const { stockId } = req.params;
    await Stock.destroy({ where: { id: stockId } });
    res.json({ message: 'Stock deleted' });
});

export default router;