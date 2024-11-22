import mongoose from "mongoose";
const { Schema, model } = mongoose;

const categorySchema = new Schema(
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
      required: true, //? (done) Change to true after adding authentication
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
  },
  { timestamps: true }
);
categorySchema.post('findOneAndDelete', async function () {
  const _id=this.getQuery()._id;
  
  //? (done) delete relivant subcategories from db
  const deletedSubCategories = await mongoose.models.SubCategory.deleteMany({
    categoryId: _id,
  });
  console.log("sub category deleted");
  
  //?  (done) check if subcategories are deleted already

  if (deletedSubCategories.deletedCount) {
    //?(done) delete the relivant brands from db

    const deletedBrands = await mongoose.models.Brand.deleteMany({ categoryId: _id });
    console.log("Brand deleted");
    if (deletedBrands.deletedCount) {
      // delete the related products from db
      // test
      await mongoose.models.Product.deleteMany({ categoryId: _id });
      console.log("Product deleted");
    }
  }
})
export const Category =
  mongoose.models.Category || model("Category", categorySchema);
