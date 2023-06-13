import { Schema, model } from "mongoose";

const schema = new Schema({
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 100 },
    code: { type: String, required: true, max: 100, unique: true },
    price: { type: String, required: true, max: 100 },
    stock: { type: String, required: true, max: 100 },
    category: { type: String, required: true, max: 100 },
});

export const productsModel = model("products", schema);