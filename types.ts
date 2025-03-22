// Definisi interface untuk tipe data
export interface User {
	id: string;
	name: string;
	email: string;
}

export interface Product {
	id: string;
	name: string;
	price: number;
	stock: number;
}

export interface Order {
	id: string;
	userId: string;
	products: Array<{ productId: string; quantity: number }>;
	status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
	paymentId?: string;
}

export interface Payment {
	id: string;
	orderId: string;
	amount: number;
	status: "pending" | "completed" | "failed";
}

export interface ShippingDetails {
	orderId: string;
	address: string;
	trackingNumber?: string;
}

// Definisi tipe untuk callback functions
export type ErrorCallback<T> = (error: Error | null, result?: T) => void;
