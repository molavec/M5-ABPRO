class Inventory {
  /**
   * @param {Array} products - Array of products
   */
  constructor(products = []) {
    this.products = products;
  }

  /**
   * Returns the array of products
   * 
   * @returns {Product[]} products
   */
  getProducts() {
    return this.products;
  }

  /**
   * Obtain product by id
   * @param {*} productId product id 
   * @returns product found
   */
  getProductById(productId) {
    return this.products.find((product) => {
      return product.getId() === productId;
    });
  }

  /**
   * Adds a new product to the array of products if it doesn't exist
   * 
   * @param {Product} product - Product to be added
   */
  addProduct(product) {
    const existingProduct = this.products.find(p => p.id === product.id);
    console.log('existingProduct', existingProduct);
    console.log('product.id', product.id);
    if (!existingProduct) {
      this.products.push(product);
    }
  }

  /**
   * Removes a product from the array of products based on id
   * 
   * @param {Number} id - Id of the product to be removed
   */
  removeProduct(id) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
  }

  /**
   * Updates a product in the array of products based on id
   * 
   * @param {Product} product - Product to be updated
   */
  updateProduct(product) {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products[index] = product;
    }
  }

  /**
   * Remove quantity from the stock for a product selected from some id. 
   * @param {*} productId product id
   * @param {*} quantity quantity to be removed from stock
   * @returns new stock quantity
   */
  removeStock(productId, quantity) {
    const product = this.getProductById(productId);
    const newStock = product.getStock() - parseInt(quantity); 
    product.setStock((newStock >= 0) ? newStock : 0 );
    return product.getStock();
  }


  /**
   * Obtain products by a searchText that match with name, description or label
   * @param {String} searchText search Text
   * @returns products array that matched with search text.
   */
  searchProducts(searchText) {
    //TODO: search products by name, description or
    console.log(this.products) 
    const filteredProducts = this.products.filter((product)=>{

      console.log(product.getName())
      console.log(product.getDescription())
      // console.log(product.getLabels())
      // TODO: falta comparar las etiquetas
      return product.getName() === searchText || product.getDescription() === searchText
    })
    return filteredProducts;
  }
  /**
   * Obtain products filtered by min and max price
   * @param {Number} minPrice minimal price
   * @param {Number} searchText maximal price
   * @returns products array in range price.
  //  */
  filterProductsByPrice(minPrice,maxPrice) {
    return this.products.filter(product =>product.price >= minPrice && product.price <= maxPrice);
  }
  /**
   * Obtain filtered by Category
   * @param {String} categoryId categoryId
   * @returns products array filtered by category.
   */
  filterByCategory(categoryId) {
    const productsF = this.products;
    console.log('products filtered', productsF)
    let productfilter = productsF.filter (producto => categoryId == producto.categoryId)
    console.log(productfilter)

    return productfilter
    //TODO: search products by category Id
  }
}



export default Inventory;