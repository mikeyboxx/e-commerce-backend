// import models
const Category = require('./Category');
const Product = require('./Product');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');
 
// Categories have many Products
Category.hasMany(Product);
// Products belongsTo Category
Product.belongsTo(Category);

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {through: ProductTag});
// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {through: ProductTag});


module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
