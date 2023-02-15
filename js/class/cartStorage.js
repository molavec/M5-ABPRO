class CartStorage {
  // Usa una propiedad estática para almacenar la única instancia de la clase
  static instance;
  
  // Private constructor para que no se pueda crear una instancia fuera de la clase
  constructor() {
    if (!CartStorage.instance) {
      CartStorage.instance = this;
    }
    return CartStorage.instance;
  }
  
  // Método para agregar un objeto Cart al localStorage
  addCart(cart) {
    const carts = this.getAllCarts();
    carts.push(cart);
    localStorage.setItem("carts", JSON.stringify(carts));
  }
  
  // Método para obtener todos los objetos Cart del localStorage
  getAllCarts() {
    const carts = JSON.parse(localStorage.getItem("carts")) || [];
    return carts;
  }
  
  // Método para obtener un objeto Cart específico del localStorage
  getCart(id) {
    const carts = this.getAllCarts();
    return carts.find(cart => cart.id === id);
  }
  
  // Método para actualizar un objeto Cart en el localStorage
  updateCart(id, updates) {
    const carts = this.getAllCarts();
    const index = carts.findIndex(cart => cart.id === id);
    if (index !== -1) {
      carts[index] = { ...carts[index], ...updates };
      localStorage.setItem("carts", JSON.stringify(carts));
    }
  }
  
  // Método para eliminar un objeto Cart del localStorage
  deleteCart(id) {
    const carts = this.getAllCarts();
    const filteredCarts = carts.filter(cart => cart.id !== id);
    localStorage.setItem("carts", JSON.stringify(filteredCarts));
  }
}
  
// Crea una instancia única de la clase CartStorage
// const cartStorage = new CartStorage();
// Object.freeze(cartStorage);

export default CartStorage;