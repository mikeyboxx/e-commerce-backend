// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
const Category = require('./Category');
// import our database connection from config.js
const sequelize = require('../config/connection');
 
// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

// set up fields and rules for Product model
Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate: {
        isDecimal: true
      }
    },  
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true
      },
      defaultValue: 10
    },  
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isDecimal: true
      },
      references: {
        model: Category,
        key: 'id'
      },
      onDelete: 'CASCADE'
    },  
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;
