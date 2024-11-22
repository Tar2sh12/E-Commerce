import {
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
} from "graphql";

import { DiscountType as DT } from "../../utils/index.js";
import { Category } from "../../../DB/models/index.js";
import { CategoryType } from "./category.type.js";

const imageType = new GraphQLObjectType({
  name: "imageRoot",
  description: "this is image type",
  fields: {
    customId: { type: GraphQLID },
    URLs: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: "images",
          fields: {
            secure_url: { type: GraphQLString },
            public_id: { type: GraphQLString },
          },
        })
      ),
    },
  },
});

const DiscountType = new GraphQLObjectType({
  name: "discounts",
  fields: {
    amount: {
      type: GraphQLFloat,
    },
    type: {
      type: new GraphQLEnumType({
        name: "discountTypes",
        values: {
          PERCENTAGE: { value: DT.PERCENTAGE },
          FIXED: { value: DT.AMOUNT },
        },
      }),
    },
  },
});
export const productType = new GraphQLObjectType({
  name: "product",
  description: "this is product type",
  fields: {
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    overview: { type: GraphQLString },
    price: { type: GraphQLFloat },
    stock: { type: GraphQLInt },
    rating: { type: GraphQLFloat },
    categoryId: { type: GraphQLID },
    categoryData:{
        type:CategoryType ,
          resolve: async (parent) => {
              return await Category.findById(parent.categoryId)
          }
    },
    subCategoryId: { type: GraphQLID },
    brandId: { type: GraphQLID },
    createdBy: { type: GraphQLID },
    slug: { type: GraphQLString },
    appliedPrice: { type: GraphQLFloat },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    Images: { type: imageType },
    appliedDiscount: { type: DiscountType },
  },
});
