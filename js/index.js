import catalog from "./data/catalog.js";
import categoriesExamples from "./data/categories.js";
import { getProductListHome, getProductListRowsAdmin } from "./dom-builders.js";

import Product from "./class/product.js";

import Inventory from "./class/inventory.js";
import Category from "./class/category.js";




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

// Obtiene el inventario.
const inventory = Inventory.getInventory();
inventory.setProducts(products)


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

