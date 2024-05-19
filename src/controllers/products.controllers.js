import ProductsManager from "../mongoDb/DB/productsManager.js";
const productDao = new ProductsManager();

export const getIndex = async (req, res) => {
    try {
        const productList = await productDao.getAll();
        const leanProducts = productList.payload.products.map(product => product.toObject({ getters: true }));
        res.render('partials/index', { products: leanProducts, session: req.session });
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).send('Error interno del servidor');
    }
};

export const getProducts = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const productList = await productDao.getAll(page);
        const leanProducts = productList.payload.products.map(product => product.toObject({ getters: true }));
        const pageInfo = productList.payload.info;
        res.render('partials/products', { products: leanProducts, pageInfo });
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).send('Error interno del servidor');
    }
};


export const getIdProduct = async (req, res) => {
    try {

        const productId = req.params.id;
        const product = await productDao.getById(productId);
        res.render('partials/view', { product: product });
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).send('Internal Server Error');
    }
}

// export const adminPanelProduct = async (req, res) => {
//     try {
//         const page = req.query.page || 1;
//         const productList = await productDao.getAll(page);
//         const leanProducts = productList.payload.products.map(product => product.toObject({ getters: true }));
//         const pageInfo = productList.payload.info;
//         res.render('partials/controlPanel', { products: leanProducts, pageInfo });
//     } catch (error) {
//         console.error('Error al obtener productos:', error.message);
//         res.status(500).send('Error interno del servidor');
//     }
// }


export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const prodDel = await productDao.productDelete(id)
        if (prodDel) res.status(200).json({ msg: `Product id: ${id} deleted` });
        else res.status(404).json({ msg: "Error delete product!" });
    } catch (error) {
        next(error.message);
    }
}


// export const createProduct = async (req, res) => {
//     try {
//         const newProd = await productDao.createProduct(req.body);
//         if (newProd) {
//             res.status(200).json({ message: "Product created", newProd })
//         } else {
//             res.status(404).json({ msg: "Error create product!" })
//         };
//     } catch (error) {
//         res.status(500).json({ message: "error server", error });
//     };
// };

// export const productUpdate = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updatedProductData = req.body; // Datos actualizados del producto

//         // Llama a la función de tu DAO para actualizar el producto
//         const updatedProduct = await productDao.updateProduct(id, updatedProductData);

//         // Verifica si el producto se actualizó correctamente
//         if (updatedProduct) {
//             res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
//         } else {
//             res.status(404).json({ message: "Product not found" });
//         }
//     } catch (error) {
//         console.error("Error updating product:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };



// export const getAggregation = async (req, res) => {
//     try {
//         const { year } = req.params;
//         const getProducts = await productDao.aggregationProduct(year);
//         //verifica si hay algún producto en el array devuelto
//         if (getProducts.length > 0) {
//             res.json({ message: "List Products", getProducts });
//         } else {
//             res.status(404).json({ message: "Product not found" });
//         }
//     }
//     catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }




