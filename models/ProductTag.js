const { Model, DataTypes } = require('sequelize');
const Product = require('./Product');
const Tag = require('./Tag');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true
      },
      references: {
        model: Product,
        key: 'id'
      },
      onDelete: 'CASCADE'
      
    },  
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true
      },
      references: {
        model: Tag,
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
    modelName: 'product_tag',
  }
);
 
module.exports = ProductTag;
