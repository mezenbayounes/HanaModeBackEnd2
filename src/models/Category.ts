import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../db';

export interface ICategory {
  id: number;
  name: string;
  image?: string;
  isHidden?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryCreationAttributes extends Optional<ICategory, 'id' | 'image' | 'isHidden' | 'createdAt' | 'updatedAt'> { }

class Category extends Model<ICategory, CategoryCreationAttributes> implements ICategory {
  public id!: number;
  public name!: string;
  public image?: string;
  public isHidden?: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: '',
    },
    isHidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: true,
  }
);

export { Category };
