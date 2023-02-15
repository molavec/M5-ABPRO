import catalog from "./data/catalog.js";
import categoriesExamples from "./data/categories.js";
import { getProductListHome, getProductListCart, getProductListRowsAdmin } from "./dom-builders.js";

import Product from "./class/product.js";
import Cart from "./class/cart.js";
import Inventory from "./class/inventory.js";
import Category from "./class/category.js";


/**
 * Actualiza los totales en el carro
 */
const updateTotals = () => {
	// console.log('updateTotals', cart.getTotal());
	$("#total-neto").html(`$ ${cart.getTotal()}`);
	$("#iva").html(`$ ${cart.getTax()}`);
	$("#total").html(`$ ${cart.getTotal() + cart.getTax()}`);
	$("#shipping").html(`$ ${cart.getShippingCost()}`);
	$("#total-with-shipping").html(`$ ${cart.getTotal() + cart.getTax() + cart.getShippingCost()}`);
}

const updateProductRowsInTable = function() {
	
	// --> ADMIN: AÑADIR PRODUCTOS DINÁMINCAMENTE EN LA TABLA
	$('#product-rows').html(getProductListRowsAdmin(inventory.getProducts()));
	
	// -> ADMIN: Eliminar productos de la lista
	$('.delete-product').click(function () {
		//TODO: Eliminar producto del inventario
		const productId = $(this).attr('uuid');
		console.log('uuid aqui', productId);

		inventory.removeProduct(productId)
		console.log('products', inventory.getProducts());

		// --> ADMIN: AÑADIR PRODUCTOS DINÁMINCAMENTE EN LA TABLA
		updateProductRowsInTable();

	});

}

// crea un arreglo de productos a partir de la 'base de datos' catalog.js
export const products = catalog.map((product) => {
	return new Product(
		product.code,
		product.name,
		product.price,
		product.image,
		product.description,
		product.stock,
		product.categoryId,
	);
}
);

const categories = categoriesExamples.map((category) => {
	return new Category(category.id, category.name)
});




// Crea el objeto carro.
const cart = new Cart();

// Crea el objeto inventory.
const inventory = new Inventory(products);


// --> MANEJO DEL DOM
$(document).ready(function () {
	"use strict";

	/**===============================
	 * Llenado dinámico de datos
	 ===============================*/

	// --> AÑADE OPCIONES AL SELECTOR DEL FILTRO POR CATEGORIAS
	const filterOptionsHTML = categories.map((category) => {
		return `<option value="${category.getId()}">${category.getName()}</option>`;
	});
	// console.log(filterOptionsHTML)
	$('#filter-product-category').html(filterOptionsHTML);

	// --> AÑADE PRODUCTOS EN EL DOM
	$('#products .feature-content .row').html(getProductListHome(inventory.getProducts()));


	// --> ADMIN: AÑADIR PRODUCTOS DINÁMINCAMENTE EN LA TABLA
	updateProductRowsInTable();

	/**===============================
	 * Gestión de eventos
	 ===============================*/

	// --> CLICK ADD-TO-CART: Acciones botón anadir al carro 
	$('.add-to-cart-box .add-button').click(function () {

		// Cambia el estado de boton añadido por 1 segundo
		const addButton = $(this);
		const addedButton = $(this).siblings(".added-button");
		addButton.toggle();
		addedButton.toggle();
		setTimeout(
			function () {
				addButton.toggle();
				addedButton.toggle();
			},
			1000
		);

		// Obtiene la información del producto y crea el objeto producto
		const productInfo = JSON.parse($(this).attr('info').replace(/\'/g, '\"'));

		const product = new Product(
			productInfo.id,
			productInfo.name,
			productInfo.price,
			productInfo.image,
			productInfo.description,
			productInfo.stock,
		);

		// Obtener la cantidad de productos
		const quantity = $(this).parent()
			.parent()
			.children(".box-cantidad")
			.children(".input-cantidad")
			.val();

		// Añade productos al carro
		if (quantity > 0 && quantity <= product.getStock()) {
			cart.addItem(product, quantity);
		} else if (quantity > product.getStock()) {
			// Añade mensaje que se ha superado el stock
			$(this).parent()
				.parent()
				.parent()
				.children(".single-feature-txt")
				.children(".stock-message")
				.html(`Sólo hay ${product.getStock()} disponibles.`);

			// actualiza el valor al stock disponible
			$(this).parent()
				.parent()
				.children(".box-cantidad")
				.children(".input-cantidad")
				.val(product.getStock());
			// Añade el stock
			cart.addItem(product, product.getStock());
		} else {
			// actualiza el valor a cero
			$(this).parent()
				.parent()
				.children(".box-cantidad")
				.children(".input-cantidad")
				.val(0);
			return;
		}

		// Actualiza elementos del carro
		const productsInCartHTML = getProductListCart(cart.getItems());
		$("#totalizador .item-list").html(productsInCartHTML);

		// Actualiza el contador del ícono del carro
		$("#cart-qty").html(cart.getQuantity());

		// Actualizar totales
		updateTotals();

		// -> CLICK UPDATE ITEM IN CART: Acciones botón actualizar
		$('#totalizador .cart-refresh').click(function () {

			// Obtiene el id y la cantidad del producto a actualizar
			const quantity = $(this).parent()
				.parent()
				.children(".cart-info-box")
				.children(".cart-quantity")
				.children(".cart-quantity-input")
				.val();

			// Actualiza elemento en el objeto carro.
			if (quantity >= 0 && quantity <= product.getStock()) {
				cart.updateItem(product.getId(), quantity);
			} else if (quantity > product.getStock()) {
				// Añade mensaje que se ha superado el stock
				$(this).parent()
					.parent()
					.children(".stock-message")
					.html(`Sólo hay ${product.getStock()} dispoibles.`);

				// actualiza el valor al stock disponible
				$(this).parent()
					.parent()
					.children(".cart-info-box")
					.children(".cart-quantity")
					.children(".cart-quantity-input")
					.val(product.getStock());
				// Añade el stock
				cart.updateItem(product.getId(), product.getStock());
			} else {
				// actualiza el valor a cero
				$(this).parent()
					.parent()
					.children(".box-cantidad")
					.children(".input-cantidad")
					.val(0);
				return;
			}

			// Actualiza el contador del ícono del carro
			if (cart.getQuantity() > 0) {
				$("#cart-qty").html(cart.getQuantity());
			} else {
				$("#cart-qty").html('');
				$("#totalizador .item-list").html('<p>El carro está vacío.</p>');
			}

			// Remueve el item del DOM si el quantity es cero
			if (quantity <= 0) {
				$(this).parent().parent().parent().remove();
			}

			// Actualizar totales
			updateTotals();

			// Aleta que el carro ha sido actualizado
			$('.cart-alert').html('<span class="badge rounded-pill text-bg-warning">Carro Actualizado</span>');
			setTimeout(
				function () {
					$('.cart-alert').html('');
				},
				2000
			);

		});

		// -> CLICK DETETE ITEM IN CART: Acciones botón eliminar
		$('#totalizador .cart-remove').click(function () {

			// Obtiene el id del producto a eliminar
			const uuid = $(this).attr('uuid');

			// Eliminado elemento del carro
			cart.removeItem(uuid);

			// Actualiza el contador del ícono del carro
			if (cart.getQuantity() > 0) {
				$("#cart-qty").html(cart.getQuantity());
			} else {
				$("#cart-qty").html('');
				$("#totalizador .item-list").html('<p>El carro está vacío.</p>');
			}

			// Remueve el item del DOM
			$(this).parent().parent().parent().remove();

			// Actualiza totales
			updateTotals();
		});

	});

	// -> CLICK BUY CART: Acciones para limpiar del carro.
	$('#buy-cart').click(function () {

		// Actualiza el stock de los productos
		cart.getItems().forEach((item) => {
			inventory.removeStock(item.product.getId(), item.quantity);
		});

		// --> ACTUALIZA PRODUCTOS EN EL DOM
		$('#products .feature-content .row').html(getProductListHome(inventory.getProducts()));

		$('pruebaEditar').html(getProductListHome(inventory.getProducts()));

		// Elimina los items del carro
		cart.clear();

		// Actualiza el contador del ícono del carro
		$("#cart-qty").html('');

		// Actualiza lista elementos del carro.
		$("#totalizador .item-list").html('<p>El carro está vacío.</p>');

		// Actualiza totales
		updateTotals();

		// Alerta de que productos han sido comprados
		$('.cart-alert').html('<span class="badge rounded-pill text-bg-success">Compra realizada éxitosamente!</span>');
		setTimeout(
			function () {
				$('.cart-alert').html('');
			},
			20000
		);

	});

	// -> CLICK CLEAN CART: Acciones para limpiar del carro.
	$('#clean-cart').click(function () {

		// Elimina los items del carro
		cart.clear();

		// Actualiza el contador del ícono del carro
		$("#cart-qty").html('');

		// Actualiza lista elementos del carro.
		$("#totalizador .item-list").html('<p>El carro está vacío.</p>');

		// Actualiza totales
		updateTotals();

	});

	// -> ADMIN: Editar productos de la lista
	//
	$('.edit-product-cta').click(function () {
		$(this).parent().parent().children('.td-info').hide();
		$(this).parent().parent().children('.td-input').show();
	});

	$('#botonGuardar').click(function () {
		const updateProduct = new Product(
			document.getElementById("inputId").value,
			document.getElementById("inputNombre").value,
			document.getElementById("inputPrecio").value,
			document.getElementById("inputImagen").value,
			document.getElementById("inputDescripcion").value,
			document.getElementById("inputStock").value,
			document.getElementById("inputCategoria").value,
			document.getElementById("inputEtiqueta").value
		)

		console.log(updateProduct)

		inventory.updateProduct(updateProduct)
		console.log(inventory.getProducts())

	});

	// -> CLICK CLEAN CART: Acciones para limpiar del carro.
	$('#filter-product-category').click(function () {
		// TODO: Obtener el valor del option
		const categoryId = $(this).val();
		// console.log('options value selected', categoryId);

		// TODO: obtener los productos filtrados
		const filteredProducts = inventory.filterByCategory(categoryId);
		// console.log("-------------------------------"+filteredProducts)
		// TODO: repintar los productos.
		$('#products .feature-content .row').html(getProductListHome(filteredProducts));
	});

	// -> CLICK FILTER TEXT SEARCH: Accion filtra por texto libre los productos.
	$('#searchTextProductButton').click(function () {

		const inputSearchText = document.getElementById("searchTextProductInput").value;

		console.log("value input libre " + inputSearchText)

		const filteredtextproduct = inventory.searchProducts(inputSearchText);
		console.log("los productos que coinciden " + filteredtextproduct)

		$('#products .feature-content .row').html(getProductListHome(filteredtextproduct));
	});

	// -> CLICK FILTER PRICE: Accion filtra por precio los productos.
	$('#btnRango').click(function () {
		let minPrice = document.getElementById('intMinimo');
		let maxPrice = document.getElementById('intMaximo');

		const filteredProductsRango = inventory.filterProductsByPrice(minPrice.value, maxPrice.value);

		//TODO: display filtered products on page
		$('#products .feature-content .row').html(getProductListHome(filteredProductsRango));
	});

	// -> CLICK SHOW INPUT: Accion de mostrar formulario agregar producto.
	$("#new-product-cta").click(function () {
		$("#add-product-admin-box").show();
	});

	// -> CLICK ADD NEW PRODUCT
	$("#btnNewProduct").click(function () {

		// obtiendo valores del input
		let inputImg = $("#inputImg")
		let inputName = $("#inputName")
		let inputCode = $("#inputCode")
		let inputDescription = $("#inputDescription")
		let inputPrice = $("#inputPrice")
		let inputStock = $("#inputStock")
		let inputCategoryId = $("#inputCategoryId")

		// se crea el objeto producto
		const newProduct = new Product(
			inputCode.val(),
			inputName.val(),
			inputPrice.val(),
			inputImg.val(),
			inputDescription.val(),
			inputStock.val(),
			inputCategoryId.val(),
		);

		// Agrega producto a inventario
		inventory.addProduct(newProduct);
		console.log('inventaRIO updatedd', inventory.getProducts())

		// repintar filas en tabla inventario
		// --> ADMIN: AÑADIR PRODUCTOS DINÁMINCAMENTE EN LA TABLA
		updateProductRowsInTable();

		// Limpia inputs formularios
		inputImg.val('');
		inputName.val('');
		inputCode.val('');
		inputDescription.val('');
		inputPrice.val('');
		inputStock.val('');
		inputCategoryId.val('');

		//esconder formulario nuevo producto
		$("#add-product-admin-box").hide();
		

	});

});

