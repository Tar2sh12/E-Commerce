import { Product } from "../../../DB/models/index.js";

export const listProducts = async () => {
    return await Product.find();
}