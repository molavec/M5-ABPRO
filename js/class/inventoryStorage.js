class InventoryStorage {
  // Implementación del patrón singleton
  static instance;
  static getInstance() {
    if (!InventoryStorage.instance) {
      InventoryStorage.instance = new InventoryStorage();
    }
    return InventoryStorage.instance;
  }

  constructor() {
    // Comprueba si ya existe una lista de inventario en el localStorage
    if (!localStorage.getItem("inventory")) {
      localStorage.setItem("inventory", JSON.stringify([]));
    }
  }

  // Método para obtener todos los elementos del inventario
  getAll() {
    return JSON.parse(localStorage.getItem("inventory"));
  }

  // Método para agregar un nuevo elemento al inventario
  add(inventoryItem) {
    const inventory = this.getAll();
    inventory.push(inventoryItem);
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }

  // Método para actualizar un elemento del inventario
  update(inventoryItem) {
    const inventory = this.getAll();
    const index = inventory.findIndex((i) => i.id === inventoryItem.id);
    inventory[index] = inventoryItem;
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }

  // Método para eliminar un elemento del inventario
  remove(inventoryItemId) {
    const inventory = this.getAll().filter((i) => i.id !== inventoryItemId);
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }
}

export default InventoryStorage;