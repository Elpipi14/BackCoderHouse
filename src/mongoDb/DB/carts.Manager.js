import { CartModel } from "../schema/carts.model.js";
import { ProductsModel } from "../schema/products.model.js";

export default class CartsManager {

    async createCart() {
        try {
            const newCart = new CartModel({
                // Inicializa el carrito sin productos
                products: [],
            });
            // Guarda el nuevo carrito en la base de datos
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error(error);
            console.error("Error create cart", error);
            throw error;
        }
    }

    async addToCart(cartId, productId) {
        try {
            // Busca el producto 
            const product = await ProductsModel.findById(productId);
            if (!product) {
                throw new Error(`Product not found for ID: ${productId}`);
            };

            // Verifica si hay suficiente stock disponible
            if (product.stock <= 0) {
                throw new Error(`No stock available for product: ${product.title}`);
            }

            // Busca el carrito 
            let cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error(`Cart not found for ID: ${cartId}`);
            };

            // Si el carrito no tiene productos, se crea como un array vacío
            if (!cart.products) {
                cart.products = [];
            };

            // Busca si el producto ya existe en el carrito
            const existingProduct = cart.products.find(item => item.product.equals(productId));

            // Si el producto ya está en el carrito, incrementa la cantidad
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                // Si el producto no está en el carrito, lo añade al array 'products' del carrito
                cart.products.push({
                    product: productId,
                    quantity: 1
                });
            };

            // Reduce la cantidad disponible del producto en el stock
            product.stock -= 1;
            await product.save();

            // Guarda el carrito actualizado en la base de datos
            cart = await cart.save();
            return cart; // Devuelve el carrito actualizado
        } catch (error) {
            console.error("Error add product to cart", error);
            throw error;
        }
    };


    async getAll() {
        try {
            const carts = await CartModel.find()
            return carts;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getById(id) {
        try {
            //obtener un carrito por su ID con sus productos
            const cart = await CartModel.findById(id);
            return cart;
        } catch (error) {
            console.error("error searching ID", error);
        };
    };

    async deleteProduct(cartId, productId) {
        try {
            // Busca el carrito en la base de datos
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error(`Cart not found for ID: ${cartId}`);
            }

            // Encuentra y elimina el producto del carrito
            const removedProductIndex = cart.products.findIndex(item => item.product.equals(productId));
            if (removedProductIndex === -1) {
                throw new Error(`Product not found in cart`);
            }

            // Encuentra el producto eliminado para aumentar su stock disponible
            const removedProduct = cart.products[removedProductIndex];
            cart.products.splice(removedProductIndex, 1);

            const updatedCart = await cart.save();

            // Aumenta el stock disponible del producto eliminado
            const product = await ProductsModel.findById(productId);
            if (product) {
                product.stock += removedProduct.quantity;
                await product.save();
            }

            return updatedCart;
        } catch (error) {
            console.error("Error deleting product from cart", error);
            throw error; // Maneja y relanza cualquier error que ocurra
        }
    }

    async deleteCart(cartId) {
        try {
            // Elimina el carrito por su ID
            const deletedCart = await CartModel.findByIdAndDelete(cartId);
            return deletedCart;
        } catch (error) {
            console.error("error delete cart", error);
            throw error;
        }
    };
    async increaseQuantity(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error(`Cart not found for ID: ${cartId}`);
            }

            const product = await ProductsModel.findById(productId);
            if (!product) {
                throw new Error(`Product not found for ID: ${productId}`);
            }

            const cartProduct = cart.products.find(p => p.product.equals(productId));
            if (!cartProduct) {
                throw new Error(`Product not found in cart`);
            }

            if (product.stock <= 0) {
                throw new Error(`No stock available for product: ${product.title}`);
            }

            cartProduct.quantity += 1;
            product.stock -= 1;

            await product.save();
            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error increasing product quantity in cart:', error);
            throw error;
        }
    }

    async decreaseQuantity(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error(`Cart not found for ID: ${cartId}`);
            }

            const product = await ProductsModel.findById(productId);
            if (!product) {
                throw new Error(`Product not found for ID: ${productId}`);
            }

            const cartProduct = cart.products.find(p => p.product.equals(productId));
            if (!cartProduct) {
                throw new Error(`Product not found in cart`);
            }

            if (cartProduct.quantity <= 1) {
                throw new Error(`Cannot decrease quantity below 1`);
            }

            cartProduct.quantity -= 1;
            product.stock += 1;

            await product.save();
            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error decreasing product quantity in cart:', error);
            throw error;
        }
    }
};

