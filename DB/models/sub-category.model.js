import mongoose from "mongoose";
const { Schema, model } = mongoose;

const subcategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, //? done: Change to true after adding authentication
    },
    Images: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
        unique: true,
      },
    },
    customId: {
      type: String,
      required: true,
      unique: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);
subcategorySchema.post('findOneAndDelete', async function () {
  const _id=this.getQuery()._id;
    const deletedBrands = await mongoose.models.Brand.deleteMany({ subCategoryId: _id });
    if (deletedBrands.deletedCount) {
      console.log("Brand deleted" );
      await mongoose.models.Product.deleteMany({ subCategoryId: _id });
      console.log("Product deleted");
  }
})
export const SubCategory =
  mongoose.models.SubCategory || model("SubCategory", subcategorySchema);