// =====================================
// 2. PROMISE HEAVEN - BEST PRACTICES
// =====================================

import type {
	Order,
	Payment,
	Product,
	ShippingDetails,
	User,
} from "./types.ts";

// 2.1 Mengubah callback API menjadi Promise API
function getUserByIdPromise(userId: string): Promise<User> {
	console.log(`Fetching user data for ID: ${userId}...`);
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (Math.random() < 0.1) {
				reject(new Error("Database connection failed"));
			} else {
				resolve({
					id: userId,
					name: "John Doe",
					email: "john@example.com",
				});
			}
		}, 500);
	});
}

function getOrdersByUserPromise(userId: string): Promise<Order[]> {
	console.log(`Fetching orders for user ID: ${userId}...`);
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (Math.random() < 0.1) {
				reject(new Error("Failed to retrieve orders"));
			} else {
				resolve([
					{
						id: "order123",
						userId: userId,
						products: [{ productId: "prod1", quantity: 2 }],
						status: "pending",
					},
				]);
			}
		}, 700);
	});
}

function getProductDetailsPromise(productId: string): Promise<Product> {
	console.log(`Fetching product details for ID: ${productId}...`);
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (Math.random() < 0.1) {
				reject(new Error("Product not found"));
			} else {
				resolve({
					id: productId,
					name: "Awesome Product",
					price: 49.99,
					stock: 10,
				});
			}
		}, 600);
	});
}

function checkStockPromise(
	product: Product,
	quantity: number,
): Promise<boolean> {
	console.log(`Checking stock for product: ${product.name}...`);
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (Math.random() < 0.1) {
				reject(new Error("Inventory system error"));
			} else {
				const isAvailable = product.stock >= quantity;
				resolve(isAvailable);
			}
		}, 400);
	});
}

function processPaymentPromise(order: Order, amount: number): Promise<Payment> {
	console.log(`Processing payment for order ID: ${order.id}...`);
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (Math.random() < 0.1) {
				reject(new Error("Payment processing failed"));
			} else {
				const payment: Payment = {
					id: `pay_${Math.random().toString(36).substr(2, 9)}`,
					orderId: order.id,
					amount: amount,
					status: "completed",
				};
				resolve(payment);
			}
		}, 800);
	});
}

function updateOrderStatusPromise(
	orderId: string,
	status: Order["status"],
): Promise<Order> {
	console.log(`Updating order status for ID: ${orderId} to ${status}...`);
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (Math.random() < 0.1) {
				reject(new Error("Failed to update order status"));
			} else {
				const updatedOrder: Order = {
					id: orderId,
					userId: "user123",
					products: [{ productId: "prod1", quantity: 2 }],
					status: status,
				};
				resolve(updatedOrder);
			}
		}, 500);
	});
}

function createShipmentPromise(
	order: Order,
	address: string,
): Promise<ShippingDetails> {
	console.log(`Creating shipment for order ID: ${order.id}...`);
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (Math.random() < 0.1) {
				reject(new Error("Shipping service unavailable"));
			} else {
				const shipping: ShippingDetails = {
					orderId: order.id,
					address: address,
					trackingNumber: `TRK${Math.floor(Math.random() * 1000000)}`,
				};
				resolve(shipping);
			}
		}, 900);
	});
}

function sendOrderConfirmationPromise(
	email: string,
	_order: Order,
	shipping: ShippingDetails,
): Promise<boolean> {
	console.log(`Sending order confirmation to: ${email}...`);
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (Math.random() < 0.1) {
				reject(new Error("Email service down"));
			} else {
				console.log(
					`Email sent to ${email} with tracking number ${shipping.trackingNumber}`,
				);
				resolve(true);
			}
		}, 300);
	});
}

// 2.2 Promise chain: Lebih baik dari callback hell
function processOrderWithPromises(
	userId: string,
	productId: string,
	quantity: number,
	address: string,
): Promise<string> {
	let userData: User;
	let currentOrder: Order;
	let productData: Product;
	let updatedOrder: Order;
	let shippingDetails: ShippingDetails;

	return getUserByIdPromise(userId)
		.then((user) => {
			userData = user;
			return getOrdersByUserPromise(userId);
		})
		.then((orders) => {
			if (orders.length === 0) {
				throw new Error("No orders found");
			}
			currentOrder = orders[0];
			return getProductDetailsPromise(productId);
		})
		.then((product) => {
			productData = product;
			return checkStockPromise(product, quantity);
		})
		.then((isAvailable) => {
			if (!isAvailable) {
				throw new Error("Product out of stock");
			}
			return processPaymentPromise(currentOrder, productData.price * quantity);
		})
		.then(() => {
			return updateOrderStatusPromise(currentOrder.id, "processing");
		})
		.then((order) => {
			updatedOrder = order;
			return createShipmentPromise(order, address);
		})
		.then((shipping) => {
			shippingDetails = shipping;
			return updateOrderStatusPromise(updatedOrder.id, "shipped");
		})
		.then((shippedOrder) => {
			return sendOrderConfirmationPromise(
				userData.email,
				shippedOrder,
				shippingDetails,
			);
		})
		.then(() => {
			return `Order ${currentOrder.id} processed successfully and shipped to ${address}`;
		});
}

// 2.3 Async/await: "Promise Heaven" atau "Async/Await Paradise"
async function processOrderWithAsyncAwait(
	userId: string,
	productId: string,
	quantity: number,
	address: string,
): Promise<string> {
	try {
		// Mengambil data user
		const user = await getUserByIdPromise(userId);

		// Mengambil pesanan
		const orders = await getOrdersByUserPromise(userId);
		if (orders.length === 0) {
			throw new Error("No orders found");
		}
		const currentOrder = orders[0];

		// Mengambil data produk
		const product = await getProductDetailsPromise(productId);

		// Memeriksa stok
		const isAvailable = await checkStockPromise(product, quantity);
		if (!isAvailable) {
			throw new Error("Product out of stock");
		}

		// Memproses pembayaran
		await processPaymentPromise(currentOrder, product.price * quantity);

		// Update status pesanan
		const updatedOrder = await updateOrderStatusPromise(
			currentOrder.id,
			"processing",
		);

		// Membuat pengiriman
		const shipping = await createShipmentPromise(updatedOrder, address);

		// Update status pesanan menjadi shipped
		const shippedOrder = await updateOrderStatusPromise(
			updatedOrder.id,
			"shipped",
		);

		// Kirim email konfirmasi
		await sendOrderConfirmationPromise(user.email, shippedOrder, shipping);

		// Return hasil akhir
		return `Order ${currentOrder.id} processed successfully and shipped to ${address}`;
	} catch (error) {
		// Centralized error handling
		console.error("Error in order processing:", error);
		throw error;
	}
}

// 2.4 Modularisasi: Memecah fungsi besar menjadi fungsi-fungsi yang lebih kecil
// Contoh pemecahan fungsi processOrderWithAsyncAwait
async function verifyOrderDetails(
	userId: string,
	productId: string,
	quantity: number,
): Promise<{ user: User; order: Order; product: Product }> {
	const user = await getUserByIdPromise(userId);

	const orders = await getOrdersByUserPromise(userId);
	if (orders.length === 0) {
		throw new Error("No orders found");
	}

	const product = await getProductDetailsPromise(productId);

	const isAvailable = await checkStockPromise(product, quantity);
	if (!isAvailable) {
		throw new Error("Product out of stock");
	}

	return { user, order: orders[0], product };
}

async function handlePaymentAndUpdate(
	order: Order,
	amount: number,
): Promise<Order> {
	await processPaymentPromise(order, amount);
	return await updateOrderStatusPromise(order.id, "processing");
}

async function handleShipping(
	order: Order,
	address: string,
	userEmail: string,
): Promise<ShippingDetails> {
	const shipping = await createShipmentPromise(order, address);
	const shippedOrder = await updateOrderStatusPromise(order.id, "shipped");
	await sendOrderConfirmationPromise(userEmail, shippedOrder, shipping);
	return shipping;
}

// Fungsi utama yang memanggil fungsi-fungsi modular
async function processOrderModular(
	userId: string,
	productId: string,
	quantity: number,
	address: string,
): Promise<string> {
	try {
		// Step 1: Verifikasi detail
		const { user, order, product } = await verifyOrderDetails(
			userId,
			productId,
			quantity,
		);

		// Step 2: Proses pembayaran dan update
		const updatedOrder = await handlePaymentAndUpdate(
			order,
			product.price * quantity,
		);

		// Step 3: Proses pengiriman
		const shipping = await handleShipping(updatedOrder, address, user.email);

		return `Order ${order.id} processed successfully and shipped to ${address} with tracking ${shipping.trackingNumber}`;
	} catch (error) {
		console.error("Order processing error:", error);
		throw error;
	}
}

// Demonstrasi Promise dan Async/Await
console.log("\n=========== PROMISE HEAVEN DEMO ===========");
console.log("Starting order processing with promises...");
processOrderWithPromises("user123", "prod1", 2, "123 Main St, City")
	.then((result) => {
		console.log("Promise Success:", result);
	})
	.catch((error) => {
		console.error("Promise Error:", error.message);
	});

console.log("\n=========== ASYNC/AWAIT PARADISE DEMO ===========");
console.log("Starting order processing with async/await...");
(async () => {
	try {
		const result = await processOrderWithAsyncAwait(
			"user123",
			"prod1",
			2,
			"123 Main St, City",
		);
		console.log("Async/Await Success:", result);
	} catch (error) {
		console.error(
			"Async/Await Error:",
			error instanceof Error ? error.message : String(error),
		);
	}
})();

console.log("\n=========== MODULAR ASYNC/AWAIT DEMO ===========");
console.log("Starting modular order processing...");
(async () => {
	try {
		const result = await processOrderModular(
			"user123",
			"prod1",
			2,
			"123 Main St, City",
		);
		console.log("Modular Success:", result);
	} catch (error) {
		console.error(
			"Modular Error:",
			error instanceof Error ? error.message : String(error),
		);
	}
})();
