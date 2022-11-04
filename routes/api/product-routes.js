const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET /api/products  - gets all products and it's associated Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({include: [Category, Tag]});

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET /api/products/:id  -   gets one Tag for that :id, and it's associated Products
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {include: [Category, Tag]});

    // if not found, tagData will be null
    if (!productData) {
      res.status(404).json({ message: 'No product with this id!' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});


// POST /api/products  - creates a new Product, and creates rows on the ProductTag table for every element in the tagIds input array, 
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",  
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product products, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tagId) => {
          return {
            productId: product.id,
            tagId,
          };
        })
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product products, just respond
      res.status(200).json(product);
    })
    // returns rows that were created on the ProductTag tables
    .then((productTagIds) => res.status(200).json(productTagIds)) 
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// PUT /api/products  - updates a Product, and re-creates rows on the ProductTag table, by deleting old recs and inserting new recs
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated products from ProductTag
      return ProductTag.findAll({ where: { productId: req.params.id } });
    })
    .then((products) => {
      // get list of current tagIds
      const productTagIds = products.map(({ tagId }) => tagId);
      // create filtered list of new tagIds
      const newProductTags = req.body.tagIds
        .filter((tagId) => !productTagIds.includes(tagId))
        .map((tagId) => {
          return {
            productId: req.params.id,
            tagId,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = products
        .filter(({ tagId }) => !req.body.tagIds.includes(tagId))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((promiseResults) => res.json(promiseResults))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// DELETE /api/products/:id  -   deletes a Product, for that :id
router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!productData) {
      res.status(404).json({ message: 'No product with this id!' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
