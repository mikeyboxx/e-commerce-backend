// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Categories have many Products
// Products belongsTo Category
Category.hasMany(Product);
Product.belongsTo(Category);

// Products belongToMany Tags (through ProductTag)
// Tags belongToMany Products (through ProductTag)
Product.belongsToMany(Tag, {through: ProductTag});
Tag.belongsToMany(Product, {through: ProductTag});


module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
