import { DataTypes, Model } from 'sequelize';
import { v7 as uuidv7 } from 'uuid';

import sequelize from '../db';

class Stock extends Model {
    public id!: string;
    public symbol!: string;
    public lastUpdate!: Date;
    public amount!: number;
}

Stock.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv7,
            primaryKey: true,
        },
        symbol: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        lastUpdate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'stocks',
    }
);

export default Stock;
