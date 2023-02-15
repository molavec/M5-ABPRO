/**
 * Cart Class
 * Class to manage a shopping cart
 * @class
 */
class Cart {
  /**
   * @property {Array} items - An array of shopping cart items
   */
  constructor() {
    this.items = [];
    this.TAX = 0.19;
    this.SHIPPING_COMMISSION = 0.05;
  }

  /**
   * Get the items in the cart
   * @returns {Array} An array of shopping cart items
   */
  getItems() {
    return this.items;
  }

  /**
   * Remove an item from the cart by id
   * @param {Number} id - The id of the product to remove
   */
  getItem(id) {
    let item = this.items.find(i => {
      return i.product.id === id 
    });
    return item;
  }

  /**
   * Add an item to the cart
   * @param {Object} product - A product object
   * @param {Number} quantity - The quantity of the product to add
   */
  addItem(product, quantity) {
    let item = this.items.find(i => i.product.id === product.id);
    if (item) {
      item.quantity += parseInt(quantity);
    } else {
      this.items.push({product: product, quantity: parseInt(quantity)});
    }
  }

  /**
   * Remove an item from the cart by id
   * @param {Number} id - The id of the product to remove
   */
  removeItem(id) {
    let index = this.items.findIndex(i => i.product.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  /**
   * Remove an item from the cart by id and quantity
   * @param {Number} id - The id of the product to remove
   * @param {Number} quantity - The quantity of the product to remove
   */
  updateItem(id, quantity) {
    let item = this.items.find(i => i.product.id === id);
    if (item) {
      item.quantity = parseInt(quantity);
      if (item.quantity <= 0) {
        this.removeItem(id);
      }
    }
  }

  /**
   * Get the quantity items in the cart
   * @returns {Integer} A number with sumatory of quantity in Items
   */
  getQuantity() {
    let totalQuantity = this.items.reduce((accumulator, i) => accumulator += i.quantity, 0);
    return totalQuantity;
  }

  /**
   * Clear all items from the cart
   */
  clear() {
    this.items = [];
  }

  /**
   * Get Total of Items
   */
  getTotal() {
    return this.items.reduce((accumulator, item) => 
      accumulator + (item.product.price * item.quantity), 0);
  }

  /**
   * Get Tax of items
   */
  getTax() {
    return this.getTotal() * this.TAX;
  }

  /**
   * Get Shipping Comision
   */
  getShippingCost() {
    return this.getTotal() * (1 + this.SHIPPING_COMMISSION);
  }

}

export default Cart;