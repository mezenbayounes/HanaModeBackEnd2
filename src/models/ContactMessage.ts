import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../db';

export interface IContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'read';
  createdAt?: Date;
  updatedAt?: Date;
}

interface ContactMessageCreationAttributes extends Optional<IContactMessage, 'id' | 'phone' | 'status' | 'createdAt' | 'updatedAt'> { }

class ContactMessage extends Model<IContactMessage, ContactMessageCreationAttributes> implements IContactMessage {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone?: string;
  public message!: string;
  public status!: 'new' | 'read';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ContactMessage.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('new', 'read'),
      allowNull: false,
      defaultValue: 'new',
    },
  },
  {
    sequelize,
    tableName: 'contact_messages',
    timestamps: true,
  }
);

export { ContactMessage };
