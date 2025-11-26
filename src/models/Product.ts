import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../db';

export interface IColor {
  name: string;
  code: string;
}

export interface ISize {
  size: string;
  inStock: boolean;
  colors: IColor[];
}

export interface IProduct {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  discountPrice?: number;
  inStock: boolean;
  images: string[];
  sizes: ISize[];
  color?: IColor[];
  featured?: boolean;
  bestSeller?: boolean;
  isHidden?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes extends Optional<IProduct, 'id' | 'discountPrice' | 'color' | 'featured' | 'bestSeller' | 'isHidden' | 'createdAt' | 'updatedAt'> { }

class Product extends Model<IProduct, ProductCreationAttributes> implements IProduct {
  public id!: number;
  public name!: string;
  public category!: string;
  public description!: string;
  public price!: number;
  public discountPrice?: number;
  public inStock!: boolean;
  public images!: string[];
  public sizes!: ISize[];
  public color?: IColor[];
  public featured?: boolean;
  public bestSeller?: boolean;
  public isHidden?: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
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
    category: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discountPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    inStock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    sizes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    color: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    bestSeller: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    isHidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
  }
);

export { Product };
