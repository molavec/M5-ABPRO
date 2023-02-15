/**
 * Clase que representa un producto
 * @constructor
 * @param {number} id - El id único del producto
 * @param {string} name - El nombre del producto
 * @param {number} price - El precio del producto
 * @param {string} image - La ruta de la imagen del producto
 * @param {string} description - La descripción del producto
 * @param {number} stock - La cantidad disponible del producto
 */
class Product {
  constructor(id, name, price, image, description, stock, categoryId = '', labels = []) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.description = description;
    this.stock = stock;
    this.categoryId = categoryId;
    this.labels = labels 
  }

  /**
   * Getter para el id
   * @return {number} id
   */
  getId() {
    return this.id;
  }
  /**
   * Setter para el id
   * @param {number} id
   */
  setId(id) {
    this.id = id;
  }

  /**
   * Getter para el nombre
   * @return {string} name
   */
  getName() {
    return this.name;
  }

  /**
   * Setter para el nombre
   * @param {string} name
   */
  setName(name) {
    this.name = name;
  }

  /**
   * Getter para el precio
   * @return {number} price
   */
  getPrice() {
    return this.price;
  }

  /**
   * Setter para el precio
   * @param {number} price
   */
  setPrice(price) {
    this.price = price;
  }

  /**
   * Getter para la imagen
   * @return {string} image
   */
  getImage() {
    return this.image;
  }

  /**
   * Setter para la imagen
   * @param {string} image
   */
  setImage(image) {
    this.image = image;
  }

  /**
   * Getter para la descripción
   * @return {string} description
   */
  getDescription() {
    return this.description;
  }

  /**
   * Setter para la descripción
   * @param {string} description
   */
  setDescription(description) {
    this.description = description;
  }

  /**
   * Getter para el stock
   * @return {number} stock
   */
  getStock() {
    return this.stock;
  }

  /**
   * Setter para el stock
   * @param {number} stock
   */
  setStock(stock) {
    this.stock = stock;
  }

  /**
   * Getter para el stock
   * @return {number} stock
   */
  getCategoryId() {
    return this.categoryId;
  }

  /**
   * Setter para el stock
   * @param {number} stock
   */
  setCategoryId(categoryId) {
    this.categoryId = categoryId;
  }

  /**
   * getter para los labels
   * @returns un arreglo de etiquetas del producto
   */
  getlabels(){
    return this.labels
  }
/**
 * setter para el categoria
 * @param {string} 
 */
  setlabels(label){
    this.labels=label
  }

}

export default Product;
