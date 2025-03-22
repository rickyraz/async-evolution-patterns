// Contoh Callback Hell dalam TypeScript
import type { ErrorCallback, Order, Payment, Product, ShippingDetails, User } from './types.ts';
// Simulasi pemrosesan pesanan online dengan banyak operasi asynchronous

// Implementasi fungsi-fungsi pemrosesan dengan callback
function getUserById(userId: string, callback: ErrorCallback<User>): void {
	console.log(`Fetching user data for ID: ${userId}...`);
	setTimeout(() => {
		if (Math.random() < 0.1) {
			// 10% chance of error
			callback(new Error("Database connection failed"));
		} else {
			callback(null, {
				id: userId,
				name: "John Doe",
				email: "john@example.com",
			});
		}
	}, 500);
}

function getOrdersByUser(
	userId: string,
	callback: ErrorCallback<Order[]>,
): void {
	console.log(`Fetching orders for user ID: ${userId}...`);
	setTimeout(() => {
		if (Math.random() < 0.1) {
			callback(new Error("Failed to retrieve orders"));
		} else {
			callback(null, [
				{
					id: "order123",
					userId: userId,
					products: [{ productId: "prod1", quantity: 2 }],
					status: "pending",
				},
			]);
		}
	}, 700);
}

function getProductDetails(
	productId: string,
	callback: ErrorCallback<Product>,
): void {
	console.log(`Fetching product details for ID: ${productId}...`);
	setTimeout(() => {
		if (Math.random() < 0.1) {
			callback(new Error("Product not found"));
		} else {
			callback(null, {
				id: productId,
				name: "Awesome Product",
				price: 49.99,
				stock: 10,
			});
		}
	}, 600);
}

function checkStock(
	product: Product,
	quantity: number,
	callback: ErrorCallback<boolean>,
): void {
	console.log(`Checking stock for product: ${product.name}...`);
	setTimeout(() => {
		if (Math.random() < 0.1) {
			callback(new Error("Inventory system error"));
		} else {
			const isAvailable = product.stock >= quantity;
			callback(null, isAvailable);
		}
	}, 400);
}

function processPayment(
	order: Order,
	amount: number,
	callback: ErrorCallback<Payment>,
): void {
	console.log(`Processing payment for order ID: ${order.id}...`);
	setTimeout(() => {
		if (Math.random() < 0.1) {
			callback(new Error("Payment processing failed"));
		} else {
			const payment: Payment = {
				id: `pay_${Math.random().toString(36).substr(2, 9)}`,
				orderId: order.id,
				amount: amount,
				status: "completed",
			};
			callback(null, payment);
		}
	}, 800);
}

function updateOrderStatus(
	orderId: string,
	status: Order["status"],
	callback: ErrorCallback<Order>,
): void {
	console.log(`Updating order status for ID: ${orderId} to ${status}...`);
	setTimeout(() => {
		if (Math.random() < 0.1) {
			callback(new Error("Failed to update order status"));
		} else {
			const updatedOrder: Order = {
				id: orderId,
				userId: "user123",
				products: [{ productId: "prod1", quantity: 2 }],
				status: status,
			};
			callback(null, updatedOrder);
		}
	}, 500);
}

function createShipment(
	order: Order,
	address: string,
	callback: ErrorCallback<ShippingDetails>,
): void {
	console.log(`Creating shipment for order ID: ${order.id}...`);
	setTimeout(() => {
		if (Math.random() < 0.1) {
			callback(new Error("Shipping service unavailable"));
		} else {
			const shipping: ShippingDetails = {
				orderId: order.id,
				address: address,
				trackingNumber: `TRK${Math.floor(Math.random() * 1000000)}`,
			};
			callback(null, shipping);
		}
	}, 900);
}

function sendOrderConfirmation(
	email: string,
	_order: Order,
	shipping: ShippingDetails,
	callback: ErrorCallback<boolean>,
): void {
	console.log(`Sending order confirmation to: ${email}...`);
	setTimeout(() => {
		if (Math.random() < 0.1) {
			callback(new Error("Email service down"));
		} else {
			console.log(
				`Email sent to ${email} with tracking number ${shipping.trackingNumber}`,
			);
			callback(null, true);
		}
	}, 300);
}

// Contoh Callback Hell: Pemrosesan pesanan
function processOrder(
	userId: string,
	productId: string,
	quantity: number,
	address: string,
	finalCallback: ErrorCallback<string>,
): void {
	// Dapatkan informasi pengguna
	getUserById(userId, (userError, user) => {
		if (userError) {
			return finalCallback(userError);
		}

		if (!user) {
			return finalCallback(new Error("User not found"));
		}

		// Dapatkan pesanan pengguna
		getOrdersByUser(userId, (orderError, orders) => {
			if (orderError) {
				return finalCallback(orderError);
			}

			if (!orders || orders.length === 0) {
				return finalCallback(new Error("No orders found"));
			}

			const currentOrder = orders[0];

			// Dapatkan detail produk
			getProductDetails(productId, (productError, product) => {
				if (productError) {
					return finalCallback(productError);
				}

				if (!product) {
					return finalCallback(new Error("Product not found"));
				}

				// Periksa ketersediaan stok
				checkStock(product, quantity, (stockError, isAvailable) => {
					if (stockError) {
						return finalCallback(stockError);
					}

					if (!isAvailable) {
						return finalCallback(new Error("Product out of stock"));
					}

					// Proses pembayaran
					processPayment(
						currentOrder,
						product.price * quantity,
						(paymentError, payment) => {
							if (paymentError) {
								return finalCallback(paymentError);
							}

							if (!payment) {
								return finalCallback(new Error("Payment failed"));
							}

							// Update status pesanan
							updateOrderStatus(
								currentOrder.id,
								"processing",
								(updateError, updatedOrder) => {
									if (updateError) {
										return finalCallback(updateError);
									}

									if (!updatedOrder) {
										return finalCallback(new Error("Order update failed"));
									}

									// Buat pengiriman
									createShipment(
										updatedOrder,
										address,
										(shipmentError, shipping) => {
											if (shipmentError) {
												return finalCallback(shipmentError);
											}

											if (!shipping) {
												return finalCallback(
													new Error("Shipment creation failed"),
												);
											}

											// Update status pesanan lagi
											updateOrderStatus(
												updatedOrder.id,
												"shipped",
												(statusError, shippedOrder) => {
													if (statusError) {
														return finalCallback(statusError);
													}

													if (!shippedOrder) {
														return finalCallback(
															new Error("Order status update failed"),
														);
													}

													// Kirim konfirmasi email
													sendOrderConfirmation(
														user.email,
														shippedOrder,
														shipping,
														(emailError, emailSent) => {
															if (emailError) {
																return finalCallback(emailError);
															}

															if (!emailSent) {
																return finalCallback(
																	new Error("Email confirmation failed"),
																);
															}

															// Akhirnya selesai!
															finalCallback(
																null,
																`Order ${shippedOrder.id} processed successfully and shipped to ${address}`,
															);
														},
													);
												},
											);
										},
									);
								},
							);
						},
					);
				});
			});
		});
	});
}

// Demonstrasi penggunaan
console.log("Starting order processing...");
processOrder("user123", "prod1", 2, "123 Main St, City", (error, result) => {
	if (error) {
		console.error("Order processing failed:", error.message);
	} else {
		console.log("Success:", result);
	}
});
console.log("Order processing initiated. Waiting for completion...");