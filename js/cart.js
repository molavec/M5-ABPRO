import Cart from "./class/cart.js";
import Product from "./class/product.js";
import { getProductListHome, getProductListCart } from "./dom-builders.js";

import Inventory from "./class/inventory.js";


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


// Crea el objeto carro.
const cart = new Cart();

// Obtiene el inventario.
const inventory = Inventory.getInventory();



// --> MANEJO DEL DOM
$(document).ready(function () {
	"use strict";

	/**===============================
	 * Gestión de eventos
	 ===============================*/

	// --> CLICK ADD-TO-CART: Acciones botón anadir al carro 
	$('.add-to-cart-box .add-button').click(function () {

    console.log('CLICK ADDTOCART');

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

});

