const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Product name is required"], trim: true, maxlength: [100, "Name cannot exceed 100 characters"] },
    description: { type: String, required: [true, "Description is required"], maxlength: [2000, "Description cannot exceed 2000 characters"] },
    brand: { type: String, required: [true, "Brand is required"] },
    category: {
        type: String, required: [true, "Category is required"],
        enum: [
            "T-Shirts", "Shirts", "Jeans", "Pants",
            "Dresses", "Skirts", "Jackets", "Activewear",
            "Underwear", "Socks", "Swimwear", "Formal Wear"
        ]
    },
    gender: { type: String, enum: ["Men", "Women", "Unisex", "Kids"], required: true },
    price: { type: Number, required: [true, "Price is required"], min: [0, "Price must be at least 0"] },
    discountPrice: {
        type: Number,
        validate: { validator: function (value) { return value < this.price; }, message: "Discount price must be less than regular price" }
    },
    stock: { type: Number, required: true, default: 0, min: [0, "Stock cannot be negative"] },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },

    // mainImage: {
    //     url: { type: String, required: [true, "Main image URL is required"] },
    //     public_id: { type: String, required: [true, "Main image public_id is required"] }
    // },
    // images: [{ url: String, public_id: String }],

    sizes: [{ type: String, enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"] }],
    colors: [{ name: String, hexCode: String }],
    variants: [{ color: String, size: String, stock: Number }],
    fabric: { type: String, required: true, enum: ["Cotton", "Polyester", "Silk", "Wool", "Denim", "Linen", "Spandex", "Nylon"] },
    ratings: { type: Number, default: 0, min: [0, "Rating cannot be less than 0"], max: [5, "Rating cannot exceed 5"] },
    numOfReviews: { type: Number, default: 0 },
    reviews: [{
        user: { type: mongoose.Schema.ObjectId, ref: "UserDB", required: true },
        name: String,
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now }
    }],
    seller: { type: mongoose.Schema.ObjectId, ref: "UserDB", required: true },
    published: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("ProductDB", ProductSchema);