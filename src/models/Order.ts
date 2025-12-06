import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../db';

export interface IOrderItem {
  product: number; // Product ID
  quantity: number;
  size: string;
  color?: string;
  colorName?: string;
  colorCode?: string;
}

export interface ICustomerDetails {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
}

export interface IOrder {
  id: number;
  email?: string;
  userId?: number;
  items: IOrderItem[];
  customerDetails: ICustomerDetails;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderCreationAttributes extends Optional<IOrder, 'id' | 'email' | 'userId' | 'status' | 'orderDate' | 'createdAt' | 'updatedAt'> { }

class Order extends Model<IOrder, OrderCreationAttributes> implements IOrder {
  public id!: number;
  public email!: string;
  public userId?: number;
  public items!: IOrderItem[];
  public customerDetails!: ICustomerDetails;
  public total!: number;
  public status!: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  public orderDate!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    customerDetails: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'orders',
    timestamps: true,
    initialAutoIncrement: '1224884950',
  }
);

export { Order };
