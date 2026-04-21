import uploadFile from "../services/storage.service.js";
import productModel from "../models/product.model.js"

/**
 * @description Create a new product
 * @route POST /api/v1/product/create-product
 * @access Private
 */
const createProductController = async (req, res) => {
    try {
        const { title, description, priceAmt, priceCurrency, category } = req.body
        const seller = req.user

        const images = await Promise.all(
            req.files.map(async (file) => {
                return await uploadFile({
                    fileBuffer: file.buffer,
                    fileName: file.originalname,
                    folder: `Snitch/products/${category}`
                })
            })
        )

        const product = await productModel.create({
            title,
            description,
            price: {
                amount: priceAmt,
                currency: priceCurrency
            },
            images,
            category,
            seller: seller._id
        })

        return res.status(201)
            .json({
                success: true,
                message: "Product created successfully",
                product
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: error.message || "Internal server error"
            })
    }
}

/**
 * @description Get seller products
 * @route GET /api/v1/product/seller-products
 * @access Private
 */
const getSellerProducts = async (req, res) => {
    try {
        const seller = req.user
        const products = await productModel.find({
            seller: seller._id
        }).populate("seller", "fullname email contactNumber")

        return res.status(200)
            .json({
                success: true,
                message: "Products fetched successfully",
                products
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: error.message || "Internal server error"
            })
    }
}

/**
 * @description Get all products
 * @route GET /api/v1/product/all-products
 * @access Public
 */
const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({})
        return res.status(200)
            .json({
                success: true,
                message: "Products fetched successfully",
                products
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: error.message || "Internal server error"
            })
    }
}

/**
 * @description Get single product
 * @route GET /api/v1/product/all-products/:id
 * @access Public
 */
const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await productModel.findById(id)
        return res.status(200)
            .json({
                success: true,
                message: "Product fetched successfully",
                product
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: error.message || "Internal server error"
            })
    }
}

/**
 * @description Add product variant
 * @route POST /api/v1/product/add-variant/:productId
 * @access Private
 */
const addProductVariantController = async (req, res) => {
    try {
        const { productId } = req.params
        const { color } = req.body
        const sizes = JSON.parse(req.body.sizes)
        let images = []
        if (req.files.length > 0) {
            images = await Promise.all(
                req.files.map(async (file) => {
                    return await uploadFile({
                        fileBuffer: file.buffer,
                        fileName: file.originalname,
                        folder: "Snitch/products/variants"
                    })
                })
            )
        }

        const product = await productModel.findById(productId)
        if (!product) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Product not found"
                })
        }

        const existingVariantIndex = product.variants.findIndex(v => v.color === color)

        if (existingVariantIndex !== -1) {
            const existingVariant = product.variants[existingVariantIndex]

            if (images.length > 0) {
                existingVariant.images.push(...images)
            }

            if (sizes && sizes.length > 0) {
                sizes.forEach(newSize => {
                    const existingSizeIndex = existingVariant.sizes.findIndex(s => s.size === newSize.size)
                    if (existingSizeIndex !== -1) {
                        existingVariant.sizes[existingSizeIndex].stock += Number(newSize.stock)
                    } else {
                        existingVariant.sizes.push({
                            size: newSize.size,
                            stock: Number(newSize.stock)
                        })
                    }
                })
            }
        } else {
            const variant = {
                color,
                images,
                sizes
            }
            product.variants.push(variant)
        }

        await product.save()

        return res.status(200)
            .json({
                success: true,
                message: "Variant added/updated successfully",
                product
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: error.message || "Internal server error"
            })
    }
}

export {
    createProductController,
    getSellerProducts,
    getAllProducts,
    getSingleProduct,
    addProductVariantController
}