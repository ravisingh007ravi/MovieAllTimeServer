const { validName, validNumber, validDecimal, validURL } = require('../Validation/AllValidation.js');

exports.productData = (req, res, next) => {
    try {
        const data = req.body;
        const { name, description, brand, category, gender,price,discountPrice,stock,sizes,colors,variants,fabric,seller,ratings,numOfReviews,reviews,
          isFeatured,  isTrending,  published} = data;
        

        const requiredFields = ['name', 'description', 'brand', 'category', 'gender', 'price', 'stock', 'fabric', 'seller'];
        for (const field of requiredFields) {
            if (!data[field]) {
                return res.status(400).send({ status: false, msg: `${field} is required` });
            }
        }

        if (!validName(name)) return res.status(400).send({ status: false, msg: "Name should only contain letters and spaces" });

        if (description.length > 2000) return res.status(400).send({ status: false, msg: "Description cannot exceed 2000 characters" });

        if (!(Number(price) > 0)) return res.status(400).send({ status: false, msg: "Price must be greater than 0" });

        if (discountPrice && Number(discountPrice) >= Number(price)) return res.status(400).send({ status: false, msg: "Discount price must be less than regular price" });

        if (!validNumber(stock) || Number(stock) < 0) return res.status(400).send({ status: false, msg: "Stock must be a non-negative number" });

        const validCategories = ["T-Shirts", "Shirts", "Jeans", "Pants", "Dresses", "Skirts", "Jackets", "Activewear", "Underwear", "Socks", "Swimwear", "Formal Wear"];
        if (!validCategories.includes(category)) return res.status(400).send({ status: false, msg: "Invalid category" });

        const validGenders = ["Men", "Women", "Unisex", "Kids"];
        if (!validGenders.includes(gender)) return res.status(400).send({ status: false, msg: "Invalid gender" });

        const validFabrics = ["Cotton", "Polyester", "Silk", "Wool", "Denim", "Linen", "Spandex", "Nylon"];
        if (!validFabrics.includes(fabric)) return res.status(400).send({ status: false, msg: "Invalid fabric type" });

        
        const parseJSON = (value, fieldName) => {
            try {return JSON.parse(value); } 
            catch {throw new Error(`${fieldName} must be a valid JSON string`);}
        };

        let sizesParsed = [];
        if (sizes) {
            sizesParsed = parseJSON(sizes, 'sizes');
            const validSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"];
            for (const size of sizesParsed) {
                if (!validSizes.includes(size)) {
                    return res.status(400).send({ status: false, msg: `Invalid size value: ${size}` });
                }
            }
        }

       
        let colorsParsed = [];
        if (colors) {
            colorsParsed = parseJSON(colors, 'colors');
            for (const color of colorsParsed) {
                if (typeof color.name !== 'string' || typeof color.hexCode !== 'string') {
                    return res.status(400).send({ status: false, msg: "Each color must have 'name' and 'hexCode' as strings" });
                }
                if (!/^#([0-9A-Fa-f]{3}){1,2}$/.test(color.hexCode)) {
                    return res.status(400).send({ status: false, msg: `Invalid hexCode format: ${color.hexCode}` });
                }
            }
        }

        let variantsParsed = [];
        if (variants) {
            variantsParsed = parseJSON(variants, 'variants');
            for (const variant of variantsParsed) {
                if (typeof variant.color !== 'string' || typeof variant.size !== 'string' || typeof variant.stock !== 'number') {
                    return res.status(400).send({ status: false, msg: "Each variant must have 'color' (string), 'size' (string), and 'stock' (number)" });
                }
                if (variant.stock < 0) {
                    return res.status(400).send({ status: false, msg: "Variant stock cannot be negative" });
                }
            }
        }

       

        if (!/^[0-9a-fA-F]{24}$/.test(seller)) {
            return res.status(400).send({ status: false, msg: "seller must be a valid ObjectId" });
        }

        data.isFeatured = (isFeatured === 'true');
        data.isTrending = (isTrending === 'true');
        data.published = (published === 'true');
        req.body.sizes = sizesParsed;
        req.body.colors = colorsParsed;
        req.body.variants = variantsParsed;
        req.body.reviews = reviews ? JSON.parse(reviews) : [];

        next();
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};
