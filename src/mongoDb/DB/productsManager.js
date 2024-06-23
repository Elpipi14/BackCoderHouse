import { ProductsModel } from "../schema/products.model.js"

export default class ProductsManager {
    async getAll(page = 1, limit = 10, sortOrder, year) {
        try {
            // const filter = year ? { year: { $eq: year } } : {};
            // const sort = sortOrder ? { price: sortOrder === 'asc' ? 1 : -1 } : {};
            const options = {
                page: page,
                limit: limit,
                // sort: sort
            };

            const result = await ProductsModel.paginate({}, options);
            const nextLink = result.hasNextPage ? `?page=${result.nextPage}&limit=${limit}` : null;
            const prevLink = result.hasPrevPage ? `?page=${result.prevPage}&limit=${limit}` : null;
            return {
                status: 'success',
                payload: {
                    products: result.docs,
                    info: {
                        count: result.docs.length,
                        pages: result.totalPages,
                        page: result.page,
                        hasNextPage: result.hasNextPage,
                        hasPrevPage: result.hasPrevPage,
                        nextLink,
                        prevLink,
                    },
                },
            };
        } catch (error) {
            throw new Error('Error getting products: ' + error.message);
        }
    }

    async getById(id) {
        try {
            const prod = await ProductsModel.findById(id);
            console.log(prod);
            return prod
        } catch (error) {
            console.error("error searching ID", error);
            throw error;
        }
    }

    async createProduct(product, user) {
        try {
            const owner = user.isPremium ? user._id : 'admin';
            const newProduct = await ProductsModel.create({ ...product, owner });
            console.log("Product added successfully:", newProduct);
    
            return newProduct;
        } catch (error) {
            console.error("Error adding product:", error);
            throw error;
        }
    }

    async updateProduct(id, updatedData, user) {
        try {
            const product = await ProductsModel.findById(id);
            if (!product) {
                console.error("Product not found");
                return null;
            }
            if (product.owner.toString() !== user._id && user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const updatedProduct = await ProductsModel.findByIdAndUpdate(id, updatedData, { new: true });
            console.log("Product updated successfully:", updatedProduct);
            return updatedProduct;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    }
    
    async productDelete(id, user) {
    try {
        const product = await ProductsModel.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        if (product.owner.toString() !== user._id && user.role !== 'admin') {
            throw new Error('Unauthorized');
        }
        await ProductsModel.findByIdAndDelete(id);
        console.log("Product deleted successfully:", id);
        return product;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}

    async aggregationProduct(year) {
        try {
            const search = await ProductsModel.aggregate([
                { $match: { year: year } },
                { $sort: { price: 1 } },
            ]);

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getProductsSocket() {
        try {
            const products = await ProductsModel.find();
            return products; // Devolver un objeto con la estructura esperada
        } catch (error) {
            console.error("Error getting products", error);
            throw error;
        }
    }
};