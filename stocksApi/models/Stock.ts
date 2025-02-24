import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import { v7 as uuidv7 } from 'uuid';

class Stock extends Model {
    public id!: string;
    public symbol!: string;
    public lastUpdate!: Date;
    public userAmount!: number;
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
            defaultValue: () => {
                // Set default to yesterday's date
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                return yesterday;
            },
        },
        userAmount: {
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
