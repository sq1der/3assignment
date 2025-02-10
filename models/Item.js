const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    images: [String], // Array of 3 image URLs
    name_en: { type: String, required: true },
    name_other: { type: String, required: true },
    description_en: { type: String, required: true },
    description_other: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    deletedAt: { type: Date }
});

module.exports = mongoose.model("Item", ItemSchema);
