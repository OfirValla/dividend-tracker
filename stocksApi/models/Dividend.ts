import { DataTypes, Model } from 'sequelize';
import { v7 as uuidv7 } from 'uuid';

import sequelize from '../db';
import Stock from './Stock';

class Dividend extends Model {
    public dividend_id!: string;
    public stock_id!: string;
    public exDate!: Date;
    public recordDate!: Date;
    public payDate!: Date;
    public amount!: string;
    public amount_announced!: boolean;
}

Dividend.init(
    {
        dividend_id: {
            type: DataTypes.UUID,
            defaultValue: uuidv7,
            primaryKey: true,
        },
        stock_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Stock,
                key: 'id',
            },
        },
        exDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        recordDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        payDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount_announced: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'dividends',
    }
);

export default Dividend;
