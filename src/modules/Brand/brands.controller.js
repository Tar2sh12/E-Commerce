import slugify from "slugify";
import { nanoid } from "nanoid";
// models
import { SubCategory, Brand,User } from "../../../DB/models/index.js";
// uitls
import { cloudinaryConfig, ErrorClass, uploadFile } from "../../utils/index.js";

/**
 * @api {post} /brands/create  Create a brand
 */
export const createBrand = async (req, res, next) => {
  // check if the category and subcategory are exist
  const { category, subCategory } = req.query;

  const createdBy  =req.authUser._id;
  const isSubcategoryExist = await SubCategory.findOne({
    _id: subCategory,
    categoryId: category,
    createdBy
  }).populate("categoryId");

  if (!isSubcategoryExist) {
    return next(
      new ErrorClass("Subcategory not found", 404, "Subcategory not found")
    );
  }


  // Generating brand slug
  const { name } = req.body;
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
  const { secure_url, public_id } = await uploadFile({
    file: req.file.path,
    folder: `${process.env.UPLOADS_FOLDER}/Categories/${isSubcategoryExist.categoryId.customId}/SubCategories/${isSubcategoryExist.customId}/Brands/${customId}`,
  });

  // prepare brand object
  const brand = {
    name,
    slug,
    logo: {
      secure_url,
      public_id,
    },
    customId,
    categoryId: isSubcategoryExist.categoryId._id,
    subCategoryId: isSubcategoryExist._id,
    createdBy
  };
  // create the brand in db
  const newBrand = await Brand.create(brand);
  // send the response
  res.status(201).json({
    status: "success",
    message: "Brand created successfully",
    data: newBrand,
  });
};

/**
 * @api {GET} /sub-categories Get category by name or id or slug
 */
export const getBrands = async (req, res, next) => {
  const { id, name, slug } = req.query;
  const queryFilter = {};

  // check if the query params are present
  if (id) queryFilter._id = id;
  if (name) queryFilter.name = name;
  if (slug) queryFilter.slug = slug;

  // find the category
  const brand = await Brand.findOne(queryFilter);

  if (!brand) {
    return next(new ErrorClass("brand not found", 404, "brand not found"));
  }

  res.status(200).json({
    status: "success",
    message: "brand found",
    data: brand,
  });
};

/**
 * @api {PUT} /sub-categories/update/:_id  Update a category
 */
export const updatebrand = async (req, res, next) => {
  // get the sub-category id
  const { _id } = req.params;

  // destructuring the request body
  const { name } = req.body;

  // find the sub-category by id
  const brand = await Brand.findById(_id)
    .populate("categoryId")
    .populate("subCategoryId");
  if (!brand) {
    return next(
      new ErrorClass("subCategory not found", 404, "subCategory not found")
    );
  }
  const createdBy = req.authUser._id;
  //the admin who make this request must be who creates this sub category
  if(!brand.createdBy.equals(createdBy)){
    return next(
      new ErrorClass("Unauthorized Action", 401, "Unauthorized Action")
    );
  }

  // Update name and slug
  if (name) {
    const slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
    brand.name = name;
    brand.slug = slug;
  }

  //Update Image
  if (req.file) {
    const splitedPublicId = brand.logo.public_id.split(`${brand.customId}/`)[1];
    const { secure_url } = await uploadFile({
      file: req.file.path,
      folder: `${process.env.UPLOADS_FOLDER}/Categories/${brand.categoryId.customId}/SubCategories/${brand.subCategoryId.customId}/Brands/${brand.customId}`,
      publicId: splitedPublicId,
    });
    brand.logo.secure_url = secure_url;
  }

  // save the sub category with the new changes
  await brand.save();

  res.status(200).json({
    status: "success",
    message: "SubCategory updated successfully",
    data: brand,
  });
};
/**
 * @api {DELETE} /sub-categories/delete/:_id  Delete a category
 */
export const deleteBrand = async (req, res, next) => {
  // get the sub-category id
  const { _id } = req.params;

  // find the sub-category by id
  const brand = await Brand.findOneAndDelete({_id, createdBy: req.authUser._id})
    .populate("categoryId")
    .populate("subCategoryId");
  if (!brand) {
    return next(new ErrorClass("brand not found", 404, "brand not found"));
  }


  // delete the related image from cloudinary
  const brandPath = `${process.env.UPLOADS_FOLDER}/Categories/${brand.categoryId.customId}/SubCategories/${brand.subCategoryId.customId}/Brands/${brand.customId}`;
  // delete the related folders from cloudinary
  await cloudinaryConfig().api.delete_resources_by_prefix(brandPath);
  await cloudinaryConfig().api.delete_folder(brandPath);

  res.status(200).json({
    status: "success",
    message: "brand deleted successfully",
  });
};


/**
 * @api {get} /brands/brands-products get brands paginated with 
 */
export const getbrands = async (req, res, next) => {
  const {page=1,limit=3}=req.query
  const skip=(page-1)*limit
  const data=await Brand.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "brandId",
        as: "products",
      },
    },
  ]).limit(+limit).skip(skip);

  if(!data){
    return res.status(200).json({msg:"there is no brands"});
  }

  res.status(200).json(data)
};

/**
 * @api {get} /brands/byCatSubCatName Get brands for specific subCategory or category or name
 */
export const getBrandBySubCatName = async (req, res, next) => {
  const {categoryId , subCategoryId , name}= req.query;
  const objThatContainOnlyOne={};
  let flag = true;
  if(categoryId){
    objThatContainOnlyOne.categoryId=categoryId;
    flag= false;
  }
  if(subCategoryId){
    if(!flag){
      return res.status(404).json({msg:"you shoud enter only one of these category , subCategory , brandName"})
    }
    objThatContainOnlyOne.subCategoryId=subCategoryId;
    flag= false;
  }
  if(name){
    if(!flag){
      return res.status(404).json({msg:"you shoud enter only one of these category , subCategory , brandName"})
    }
    objThatContainOnlyOne.name=name;
    flag= false;
  }
  if(flag){
    return res.status(404).json({msg:"you shoud enter one of these category , subCategory , brandName"})
  }
  const data = await Brand.find(objThatContainOnlyOne);
  if(!data){
    return res.status(200).json({msg:"there is no brands"});
  }
  res.status(200).json(data);
}