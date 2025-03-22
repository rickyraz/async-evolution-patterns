// =====================================
// INTERFACES & TYPES
// =====================================
import { Effect, pipe } from "effect";

import type {
	Order,
	Payment,
	Product,
	ShippingDetails,
	User,
} from "./types.ts";

// Errors
class DatabaseError extends Error {
	readonly _tag = "DatabaseError";
	constructor(message: string) {
		super(message);
		this.name = "DatabaseError";
	}
}

class PaymentError extends Error {
	readonly _tag = "PaymentError";
	constructor(message: string) {
		super(message);
		this.name = "PaymentError";
	}
}

class InventoryError extends Error {
	readonly _tag = "InventoryError";
	constructor(message: string) {
		super(message);
		this.name = "InventoryError";
	}
}

class ShippingError extends Error {
	readonly _tag = "ShippingError";
	constructor(message: string) {
		super(message);
		this.name = "ShippingError";
	}
}

class NotificationError extends Error {
	readonly _tag = "NotificationError";
	constructor(message: string) {
		super(message);
		this.name = "NotificationError";
	}
}

// Union type untuk semua error
type OrderProcessingError =
	| DatabaseError
	| PaymentError
	| InventoryError
	| ShippingError
	| NotificationError;

// =====================================
// SERVICES USING EFFECT TS
// =====================================

// Service untuk User
const userService = {
	getUserById: (userId: string): Effect.Effect<User, DatabaseError> =>
		Effect.try({
			try: () => {
				console.log(`Fetching user data for ID: ${userId}...`);

				// Simulasi potensi error dengan 10% kemungkinan
				if (Math.random() < 0.1) {
					throw new DatabaseError("Database connection failed");
				}

				return {
					id: userId,
					name: "John Doe",
					email: "john@example.com",
				};
			},
			catch: (error): DatabaseError =>
				new DatabaseError(`Failed to get user: ${error}`),
		}),
};

// Service untuk Order
const orderService = {
	getOrdersByUser: (userId: string): Effect.Effect<Order[], DatabaseError> =>
		Effect.try({
			try: () => {
				console.log(`Fetching orders for user ID: ${userId}...`);

				if (Math.random() < 0.1) {
					throw new DatabaseError("Failed to retrieve orders");
				}

				return [
					{
						id: "order123",
						userId: userId,
						products: [{ productId: "prod1", quantity: 2 }],
						status: "pending",
					},
				];
			},
			catch: (error): DatabaseError =>
				new DatabaseError(`Failed to get orders: ${error}`),
		}),

	updateOrderStatus: (
		orderId: string,
		status: Order["status"],
	): Effect.Effect<Order, DatabaseError> =>
		Effect.try({
			try: () => {
				console.log(`Updating order status for ID: ${orderId} to ${status}...`);

				if (Math.random() < 0.1) {
					throw new DatabaseError("Failed to update order status");
				}

				return {
					id: orderId,
					userId: "user123",
					products: [{ productId: "prod1", quantity: 2 }],
					status: status,
				};
			},
			catch: (error): DatabaseError =>
				new DatabaseError(`Failed to update order: ${error}`),
		}),
};

// Service untuk Product
const productService = {
	getProductDetails: (
		productId: string,
	): Effect.Effect<Product, DatabaseError> =>
		Effect.try({
			try: () => {
				console.log(`Fetching product details for ID: ${productId}...`);

				if (Math.random() < 0.1) {
					throw new DatabaseError("Product not found");
				}

				return {
					id: productId,
					name: "Awesome Product",
					price: 49.99,
					stock: 10,
				};
			},
			catch: (error): DatabaseError =>
				new DatabaseError(`Failed to get product: ${error}`),
		}),

	checkStock: (
		product: Product,
		quantity: number,
	): Effect.Effect<boolean, InventoryError> =>
		Effect.try({
			try: () => {
				console.log(`Checking stock for product: ${product.name}...`);

				if (Math.random() < 0.1) {
					throw new InventoryError("Inventory system error");
				}

				return product.stock >= quantity;
			},
			catch: (error): InventoryError =>
				new InventoryError(`Failed to check stock: ${error}`),
		}),
};

// Service untuk Payment
const paymentService = {
	processPayment: (
		order: Order,
		amount: number,
	): Effect.Effect<Payment, PaymentError> =>
		Effect.try({
			try: () => {
				console.log(`Processing payment for order ID: ${order.id}...`);

				if (Math.random() < 0.1) {
					throw new PaymentError("Payment processing failed");
				}

				return {
					id: `pay_${Math.random().toString(36).substr(2, 9)}`,
					orderId: order.id,
					amount: amount,
					status: "completed",
				};
			},
			catch: (error): PaymentError =>
				new PaymentError(`Failed to process payment: ${error}`),
		}),
};

// Service untuk Shipping
const shippingService = {
	createShipment: (
		order: Order,
		address: string,
	): Effect.Effect<ShippingDetails, ShippingError> =>
		Effect.try({
			try: () => {
				console.log(`Creating shipment for order ID: ${order.id}...`);

				if (Math.random() < 0.1) {
					throw new ShippingError("Shipping service unavailable");
				}

				return {
					orderId: order.id,
					address: address,
					trackingNumber: `TRK${Math.floor(Math.random() * 1000000)}`,
				};
			},
			catch: (error): ShippingError =>
				new ShippingError(`Failed to create shipment: ${error}`),
		}),
};

// Service untuk Notification
const notificationService = {
	sendOrderConfirmation: (
		email: string,
		_order: Order,
		shipping: ShippingDetails,
	): Effect.Effect<boolean, NotificationError> =>
		Effect.try({
			try: () => {
				console.log(`Sending order confirmation to: ${email}...`);

				if (Math.random() < 0.1) {
					throw new NotificationError("Email service down");
				}

				console.log(
					`Email sent to ${email} with tracking number ${shipping.trackingNumber}`,
				);
				return true;
			},
			catch: (error): NotificationError =>
				new NotificationError(`Failed to send notification: ${error}`),
		}),
};

// =====================================
// EFFECT GENERATOR IMPLEMENTATION
// =====================================

// Menggunakan Effect.gen dengan generator
const processOrderWithEffectGen = (
	userId: string,
	productId: string,
	quantity: number,
	address: string,
): Effect.Effect<string, OrderProcessingError> => {
	return Effect.gen(function* (_) {
		// Get user data
		const user = yield* _(userService.getUserById(userId));

		// Get user orders
		const orders = yield* _(orderService.getOrdersByUser(userId));
		if (orders.length === 0) {
			return yield* _(Effect.fail(new DatabaseError("No orders found")));
		}
		const currentOrder = orders[0];

		// Get product details
		const product = yield* _(productService.getProductDetails(productId));

		// Check stock
		const isAvailable = yield* _(productService.checkStock(product, quantity));
		if (!isAvailable) {
			return yield* _(Effect.fail(new InventoryError("Product out of stock")));
		}

		// Process payment
		const _payment = yield* _(
			paymentService.processPayment(currentOrder, product.price * quantity),
		);

		// Update order status
		const updatedOrder = yield* _(
			orderService.updateOrderStatus(currentOrder.id, "processing"),
		);

		// Create shipment
		const shipping = yield* _(
			shippingService.createShipment(updatedOrder, address),
		);

		// Update order status to shipped
		const shippedOrder = yield* _(
			orderService.updateOrderStatus(updatedOrder.id, "shipped"),
		);

		// Send confirmation email
		yield* _(
			notificationService.sendOrderConfirmation(
				user.email,
				shippedOrder,
				shipping,
			),
		);

		// Return success message
		return `Order ${currentOrder.id} processed successfully and shipped to ${address} with tracking number ${shipping.trackingNumber}`;
	});
};

// =====================================
// PIPELINE IMPLEMENTATION
// =====================================

// Alternatif menggunakan pipe dan flatMap
const processOrderWithPipe = (
	userId: string,
	productId: string,
	quantity: number,
	address: string,
): Effect.Effect<string, OrderProcessingError> => {
	// Mendefinisikan state yang dibutuhkan di seluruh pipeline
	let userData: User;
	let currentOrder: Order;
	let productData: Product;
	let updatedOrder: Order;
	let shippingDetails: ShippingDetails;

	return pipe(
		// 1. Get user
		userService.getUserById(userId),
		Effect.flatMap((user) => {
			userData = user;
			return orderService.getOrdersByUser(userId);
		}),
		Effect.flatMap((orders) => {
			if (orders.length === 0) {
				return Effect.fail(
					new DatabaseError("No orders found") as OrderProcessingError,
				);
			}
			currentOrder = orders[0];
			return productService.getProductDetails(productId);
		}),
		Effect.flatMap((product) => {
			productData = product;
			return productService.checkStock(product, quantity);
		}),
		Effect.flatMap((isAvailable) => {
			if (!isAvailable) {
				return Effect.fail(
					new InventoryError("Product out of stock") as OrderProcessingError,
				);
			}
			return paymentService.processPayment(
				currentOrder,
				productData.price * quantity,
			);
		}),
		Effect.flatMap(() =>
			orderService.updateOrderStatus(currentOrder.id, "processing"),
		),
		Effect.flatMap((order) => {
			updatedOrder = order;
			return shippingService.createShipment(order, address);
		}),
		Effect.flatMap((shipping) => {
			shippingDetails = shipping;
			return orderService.updateOrderStatus(updatedOrder.id, "shipped");
		}),
		Effect.flatMap((shippedOrder) =>
			notificationService.sendOrderConfirmation(
				userData.email,
				shippedOrder,
				shippingDetails,
			),
		),
		Effect.map(
			() =>
				`Order ${currentOrder.id} processed successfully and shipped to ${address} with tracking number ${shippingDetails.trackingNumber}`,
		),
	);
};

// =====================================
// MODULAR IMPLEMENTATION WITH EFFECT
// =====================================

// Modularisasi dengan Effect
const verifyOrderDetailsEffect = (
	userId: string,
	productId: string,
	quantity: number,
): Effect.Effect<
	{ user: User; order: Order; product: Product },
	DatabaseError | InventoryError
> => {
	return Effect.gen(function* (_) {
		// Get user
		const user = yield* _(userService.getUserById(userId));

		// Get orders
		const orders = yield* _(orderService.getOrdersByUser(userId));
		if (orders.length === 0) {
			return yield* _(Effect.fail(new DatabaseError("No orders found")));
		}
		const order = orders[0];

		// Get product
		const product = yield* _(productService.getProductDetails(productId));

		// Check availability
		const isAvailable = yield* _(productService.checkStock(product, quantity));
		if (!isAvailable) {
			return yield* _(Effect.fail(new InventoryError("Product out of stock")));
		}

		return { user, order, product };
	});
};

const handlePaymentAndUpdateEffect = (
	order: Order,
	amount: number,
): Effect.Effect<Order, PaymentError | DatabaseError> => {
	return Effect.gen(function* (_) {
		// Process payment
		yield* _(paymentService.processPayment(order, amount));

		// Update order status
		return yield* _(orderService.updateOrderStatus(order.id, "processing"));
	});
};

const handleShippingEffect = (
	order: Order,
	address: string,
	userEmail: string,
): Effect.Effect<
	ShippingDetails,
	ShippingError | DatabaseError | NotificationError
> => {
	return Effect.gen(function* (_) {
		// Create shipment
		const shipping = yield* _(shippingService.createShipment(order, address));

		// Update order status
		const shippedOrder = yield* _(
			orderService.updateOrderStatus(order.id, "shipped"),
		);

		// Send confirmation
		yield* _(
			notificationService.sendOrderConfirmation(
				userEmail,
				shippedOrder,
				shipping,
			),
		);

		return shipping;
	});
};

// Fungsi utama yang memanggil fungsi-fungsi modular
const processOrderModular = (
	userId: string,
	productId: string,
	quantity: number,
	address: string,
): Effect.Effect<string, OrderProcessingError> => {
	return Effect.gen(function* (_) {
		// Step 1: Verifikasi detail
		const { user, order, product } = yield* _(
			verifyOrderDetailsEffect(userId, productId, quantity),
		);

		// Step 2: Proses pembayaran dan update
		const updatedOrder = yield* _(
			handlePaymentAndUpdateEffect(order, product.price * quantity),
		);

		// Step 3: Proses pengiriman
		const shipping = yield* _(
			handleShippingEffect(updatedOrder, address, user.email),
		);

		return `Order ${order.id} processed successfully and shipped to ${address} with tracking number ${shipping.trackingNumber}`;
	});
};

// =====================================
// ERROR HANDLING SHOWCASE
// =====================================

// Menangani error dengan lebih baik dengan Effect
const processOrderWithErrorHandling = (
	userId: string,
	productId: string,
	quantity: number,
	address: string,
): Effect.Effect<string, never> => {
	return pipe(
		processOrderModular(userId, productId, quantity, address),
		// Tangani berbagai jenis error secara spesifik
		Effect.catchTag("DatabaseError", (error: DatabaseError) =>
			Effect.succeed(`Database error handled: ${error.message}`),
		),
		Effect.catchTag("PaymentError", (error: PaymentError) =>
			Effect.succeed(`Payment error handled: ${error.message}`),
		),
		Effect.catchTag("InventoryError", (error: InventoryError) =>
			Effect.succeed(`Inventory error handled: ${error.message}`),
		),
		Effect.catchTag("ShippingError", (error: ShippingError) =>
			Effect.succeed(`Shipping error handled: ${error.message}`),
		),
		Effect.catchTag("NotificationError", (error: NotificationError) =>
			Effect.succeed(`Notification error handled: ${error.message}`),
		),
		// Tangani semua error lain
		Effect.catchAll((error) =>
			Effect.succeed(`Unexpected error handled: ${error}`),
		),
	);
};

// =====================================
// DEMONSTRASI PENGGUNAAN
// =====================================

// Demonstrasi kode
console.log("========== EFFECT TS WITH GENERATOR ==========");
Effect.runPromise(
	processOrderWithEffectGen("user123", "prod1", 2, "123 Main St"),
)
	.then((result) => console.log("Success:", result))
	.catch((error) => console.error("Error:", error));

console.log("\n========== EFFECT TS WITH PIPE ==========");
Effect.runPromise(processOrderWithPipe("user123", "prod1", 2, "123 Main St"))
	.then((result) => console.log("Success:", result))
	.catch((error) => console.error("Error:", error));

console.log("\n========== EFFECT TS MODULAR ==========");
Effect.runPromise(processOrderModular("user123", "prod1", 2, "123 Main St"))
	.then((result) => console.log("Success:", result))
	.catch((error) => console.error("Error:", error));

console.log("\n========== EFFECT TS WITH ERROR HANDLING ==========");
Effect.runPromise(
	processOrderWithErrorHandling("user123", "prod1", 2, "123 Main St"),
)
	.then((result) => console.log("Result:", result))
	.catch((error) => console.error("This should not happen:", error));

// =====================================
// RINGKASAN KEUNTUNGAN EFFECT TS
// =====================================
/*
KEUNTUNGAN MENGGUNAKAN EFFECT TS:

1. Type-Safe Error Handling:
   - Error direpresentasikan dalam tipe data
   - Tipe error disebarkan secara otomatis melalui rantai operasi
   - Compiler TypeScript memastikan semua error ditangani

2. Deferred Execution (Lazy Evaluation):
   - Effect adalah deskripsi komputasi, bukan eksekusinya
   - Eksekusi hanya terjadi saat Effect.runPromise (atau fungsi run lainnya) dipanggil
   - Memungkinkan untuk melakukan komposisi dan transformasi sebelum eksekusi

3. Composability yang Powerful:
   - Effect bisa dengan mudah digabungkan dengan operator seperti flatMap dan pipe
   - Efek-efek dapat dikomposisikan tanpa kehilangan informasi tipe

4. Syntax Bersih dengan Generator:
   - Effect.gen dengan yield* membuat kode asinkron terlihat seperti kode sinkron
   - Alur kontrol yang jelas dan linier

5. Modularitas yang Lebih Baik:
   - Pemisahan kode menjadi fungsi-fungsi yang lebih kecil dan dapat diuji
   - Abstraksi tingkat-tinggi untuk operasi yang kompleks

6. Penanganan Error yang Canggih:
   - Effect.catchTag untuk error handling berbasis tag
   - Pemrosesan error yang fleksibel dengan pipe dan catchAll

KEBALIKAN CALLBACK HELL ("EFFECT HEAVEN"):

Dengan Effect TS, kita telah mencapai "Effect Heaven" - kebalikan dari callback hell, dengan karakteristik:

1. Aliran Linear (bukan Bersarang)
   - Kode mengalir dari atas ke bawah secara linier
   - Tidak ada efek "pyramid of doom"

2. Type Safety
   - Semua error potensial terlihat dalam tipe
   - Compiler memastikan semua failure case ditangani

3. Penanganan Error yang Konsisten
   - Pola penanganan error yang seragam di seluruh aplikasi
   - Tidak perlu try/catch yang berulang

4. Maintainability yang Lebih Baik
   - Kode lebih mudah dibaca, dipahami, dan diubah
   - Fungsi-fungsi kecil yang reusable

5. Testability yang Tinggi
   - Efek dapat dengan mudah di-mock untuk testing
   - Tidak perlu callback mocking yang kompleks

6. Composability
   - Efek dapat dengan mudah digabungkan dan diubah dengan transformer
   - Pipeline yang jelas untuk transformasi data
*/
