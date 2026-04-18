import uploadFile from "../services/storage.service.js";
import productModel from "../models/product.model.js"

const createProductController = async (req, res) => {
    try {
        const { title, description, priceAmt, priceCurrency } = req.body
        const seller = req.user

        const images = await Promise.all(
            req.files.map(async (file) => {
                return await uploadFile({
                    fileBuffer: file.buffer,
                    fileName: file.originalname,
                    folder: "Snitch/products"
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

const addProductVariantController = async (req, res) => {
    try {
        const { productId } = req.params
        const { color } = req.body
        const sizes = JSON.parse(req.body.sizes)
        const images = await Promise.all(
            req.files.map(async (file) => {
                return await uploadFile({
                    fileBuffer: file.buffer,
                    fileName: file.originalname,
                    folder: "Snitch/products/variants"
                })
            })
        )

        const product = await productModel.findById(productId)
        if (!product) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Product not found"
                })
        }

        const variant = {
            color,
            images,
            sizes
        }

        product.variants.push(variant)
        await product.save()

        return res.status(200)
            .json({
                success: true,
                message: "Variant added successfully",
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