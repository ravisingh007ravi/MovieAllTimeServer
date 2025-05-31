const productModel = require('../Models/ProductModel.js');
const { validName, validNumber } = require('../Validation/AllValidation.js');

const VALID_CATEGORIES = new Set(["T-Shirts", "Shirts", "Jeans", "Pants", "Dresses", "Skirts", "Jackets", "Activewear", "Underwear", "Socks", "Swimwear", "Formal Wear"]);
const VALID_GENDERS = new Set(["Men", "Women", "Unisex", "Kids"]);
const VALID_FABRICS = new Set(["Cotton", "Polyester", "Silk", "Wool", "Denim", "Linen", "Spandex", "Nylon"]);
const VALID_SIZES = new Set(["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"]);
const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}){1,2}$/;
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;
const MAX_DESCRIPTION_LENGTH = 2000;
const parseJSON = (value, fieldName) => {
    try {
        return value ? JSON.parse(value) : (['sizes', 'colors', 'variants'].includes(fieldName) ? [] : value);
    } catch (e) {
        throw new Error(`${fieldName} must be a valid JSON string`);
    }
};

const validateColor = (color) => {
    if (typeof color.name !== 'string' || typeof color.hexCode !== 'string') {
        return "Each color must have 'name' and 'hexCode' as strings";
    }
    if (!HEX_COLOR_REGEX.test(color.hexCode)) {
        return `Invalid hexCode format: ${color.hexCode}`;
    }
    return null;
};

const validateVariant = (variant) => {
    if (typeof variant.color !== 'string' || typeof variant.size !== 'string' || typeof variant.stock !== 'number') {
        return "Each variant must have 'color' (string), 'size' (string), and 'stock' (number)";
    }
    if (variant.stock < 0) {
        return "Variant stock cannot be negative";
    }
    return null;
};

exports.createProduct = async (req, res) => {
    try {
        const data = req.body;
        const requiredFields = ['name', 'description', 'brand', 'category', 'gender', 'price', 'stock', 'fabric', 'seller'];

        const missingField = requiredFields.find(field => !data[field]);
        if (missingField) {
            return res.status(400).send({ status: false, msg: `${missingField} is required` });
        }

        const { name, description, brand, category, gender, price, discountPrice, stock,
            sizes, colors, variants, fabric, seller, isFeatured, isTrending, published,
            mainImage, images, reviews } = data;

        if (!validName(name)) return res.status(400).send({ status: false, msg: "Name should only contain letters and spaces" });


        if (description.length > MAX_DESCRIPTION_LENGTH) return res.status(400).send({ status: false, msg: `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters` });

        const priceNum = Number(price);
        if (!(priceNum > 0)) return res.status(400).send({ status: false, msg: "Price must be greater than 0" });


        const discountPriceNum = discountPrice ? Number(discountPrice) : null;
        if (discountPriceNum && discountPriceNum >= priceNum) {
            return res.status(400).send({ status: false, msg: "Discount price must be less than regular price" });
        }

        const stockNum = Number(stock);
        if (!validNumber(stock) || stockNum < 0) return res.status(400).send({ status: false, msg: "Stock must be a non-negative number" });
        if (!VALID_CATEGORIES.has(category)) return res.status(400).send({ status: false, msg: "Invalid category" });
        if (!VALID_GENDERS.has(gender)) return res.status(400).send({ status: false, msg: "Invalid gender" });
        if (!VALID_FABRICS.has(fabric)) return res.status(400).send({ status: false, msg: "Invalid fabric type" });
        if (!OBJECT_ID_REGEX.test(seller)) return res.status(400).send({ status: false, msg: "seller must be a valid ObjectId" });

        const sizesParsed = sizes ? parseJSON(sizes, 'sizes') : [];
        const invalidSize = sizesParsed.find(size => !VALID_SIZES.has(size));
        if (invalidSize) return res.status(400).send({ status: false, msg: `Invalid size value: ${invalidSize}` });

        const colorsParsed = colors ? parseJSON(colors, 'colors') : [];
        for (const color of colorsParsed) {
            const error = validateColor(color);
            if (error) return res.status(400).send({ status: false, msg: error });
        }

        const variantsParsed = variants ? parseJSON(variants, 'variants') : [];
        for (const variant of variantsParsed) {
            const error = validateVariant(variant);
            if (error) return res.status(400).send({ status: false, msg: error });
        }

        const productData = {
            name,
            description,
            brand,
            category,
            gender,
            price: priceNum,
            discountPrice: discountPriceNum,
            stock: stockNum,
            sizes: sizesParsed,
            colors: colorsParsed,
            variants: variantsParsed,
            fabric,
            isFeatured: isFeatured === 'true',
            isTrending: isTrending === 'true',
            published: published === 'true',
            reviews: reviews ? parseJSON(reviews, 'reviews') : [],
            seller
        };

        

        const createdProduct = await productModel.create(productData);

        res.status(201).send({ status: true, message: "Product created successfully", data: createdProduct,d:data });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};