import slugify from "slugify";
import { nanoid } from "nanoid";
// utils
import { ErrorClass } from "../../utils/error-class.utils.js";
import { cloudinaryConfig } from "../../utils/cloudinary.utils.js";
// models
import { Category, SubCategory, Brand ,User } from "../../../DB/models/index.js";

/**
 * @api {POST} /categories/create  create a  new category
 */
export const createCategory = async (req, res, next) => {
  // destructuring the request body
  const { name } = req.body;
  const createdBy  =req.authUser._id;

  // Generating category slug
  const slug = slugify(name, {
    replacement: "_",
    lower: true,
  });

  // Image
  if (!req.file) {
    return next(
      new ErrorClass("Please upload an image", 400, "Please upload an image")
    );
  }
  // upload the image to cloudinary
  const customId = nanoid(4);
  const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
    req.file.path,
    {
      folder: `${process.env.UPLOADS_FOLDER}/Categories/${customId}`,
    }
  );

  // prepare category object
  const category = {
    name,
    slug,
    Images: {
      secure_url,
      public_id,
    },
    customId,
    createdBy
  };

  // create the category in db
  const newCategory = await Category.create(category);

  // send the response
  res.status(201).json({
    status: "success",
    message: "Category created successfully",
    data: newCategory,
  });
};

/**
 * @api {GET} /categories Get category by name or id or slug
 */
export const getCategory = async (req, res, next) => {
  const { id, name, slug } = req.query;
  const queryFilter = {};

  // check if the query params are present
  // if exist push data into queryFilter
  if (id) queryFilter._id = id;
  if (name) queryFilter.name = name;
  if (slug) queryFilter.slug = slug;

  // find the category
  const category = await Category.findOne(queryFilter);

  if (!category) {
    return next(
      new ErrorClass("Category not found", 404, "Category not found")
    );
  }

  res.status(200).json({
    status: "success",
    message: "Category found",
    data: category,
  });
};

/**
 * @api {PUT} /categories/update/:_id  Update a category
 */
export const updateCategory = async (req, res, next) => {
  // get the category id
  const { _id } = req.params;
  const createdBy  =req.authUser._id;
  
  // find the category by id
  const category = await Category.findById(_id);

  if (!category) {
    return next(
      new ErrorClass("Category not found", 404, "Category not found")
    );
  }
  if(!category.createdBy.equals(createdBy)){
    return next(
      new ErrorClass("Unauthorized Action", 401, "Unauthorized Action")
    );
  }
  // name of the category
  const { name, public_id_new } = req.body;

  if (name) {
    const slug = slugify(name, {
      replacement: "_",
      lower: true,
    });

    category.name = name;
    category.slug = slug;
  }

  //Image
  if (req.file) {
    const splitedPublicId = category.Images.public_id.split(
      `${category.customId}/`
    )[1];

    const { secure_url } = await cloudinaryConfig().uploader.upload(
      req.file.path,
      {
        folder: `${process.env.UPLOADS_FOLDER}/Categories/${category.customId}`,
        public_id: splitedPublicId,
      }
    );
    category.Images.secure_url = secure_url;
  }

  // save the category with the new changes
  await category.save();

  res.status(200).json({
    status: "success",
    message: "Category updated successfully",
    data: category,
  });
};

/**
 * @api {DELETE} /categories/delete/:_id  Delete a category
 */
export const deleteCategory = async (req, res, next) => {
  // get the category id
  // get the category id
  const { _id } = req.params;
  const createdBy  =req.authUser._id;

  // delete the category from db
  const category = await Category.findOneAndDelete({_id});
  if (!category) {
    return next(
      new ErrorClass("Category not found", 404, "Category not found")
    );
  }
  if(!category.createdBy.equals(createdBy)){
    return next(
      new ErrorClass("Unauthorized Action", 401, "Unauthorized Action")
    );
  }
  // delete relivant images from cloudinary
  const categoryPath = `${process.env.UPLOADS_FOLDER}/Categories/${category?.customId}`;
  await cloudinaryConfig().api.delete_resources_by_prefix(categoryPath);
  await cloudinaryConfig().api.delete_folder(categoryPath);

  // send the response
  res.status(200).json({
    status: "success",
    message: "Category deleted successfully",
  });
};



// export const getCategories = async (req, res, next) => {
//   const categories = await Category.find();
//   const categoriesWithSubcategories = await Promise.all(
//     categories.map(async (category, i) => {
//       // Find subcategories for each category
//       const categoryId = categories[i]._id.toString();
//       const subcategories = await SubCategory.find({ categoryId });
//       return {
//         ...category.toObject(),
//         subcategories, 
//       };
//     })
//   );

//   res.status(200).json({ categoriesWithSubcategories });
// };
/**
 * @api {GET} /categories get categories paginated with it's sub-categories
 */
export const allCategoriesWithSubcatgories=async(req,res,next)=>{
  const {page=1,limit=3}=req.query
  const skip=(page-1)*limit
  const data=await Category.aggregate([
    {
      $lookup: {
        from: "subcategories",
        localField: "_id",
        foreignField: "categoryId",
        as: "subcategories",
      },
    },
  ]).limit(+limit).skip(skip);

  if(!data){
    return res.status(200).json({msg:"there is no categories"});
  }

  res.status(200).json(data)
}