import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
  GraphQLInputObjectType,
} from "graphql";
import { CouponTypes as CT } from "../../utils/index.js";
const couponTypeEnum = new GraphQLEnumType({
  name: "CouponTypes",
  values: {
    PERCENTAGE: {value:CT.PERCENTAGE},
    AMOUNT: {value : CT.AMOUNT},
  },
});


export const CouponType = new GraphQLObjectType({
  name: "coupon",
  description: "this is coupon type",
  fields: {
    _id: { type: GraphQLID },
    couponCode: { type: GraphQLString },
    couponAmount: { type: GraphQLFloat },
    couponType: {
      type: couponTypeEnum,
    },
    from: { type: GraphQLString },
    till: { type: GraphQLString },
    Users: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: "user",
          fields: {
            userId: { type: GraphQLID },
            maxCount: { type: GraphQLInt },
          },
        })
      ),
    },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});


export const CouponArgs ={
    token: { type: GraphQLString },
      couponCode: { type: GraphQLString },
      couponAmount: { type: GraphQLFloat },
      couponType: {
        type: new GraphQLEnumType({
            name: "CouponTypesArgs",
            values: {
              PERCENTAGE: {value:CT.PERCENTAGE},
              AMOUNT: {value : CT.AMOUNT},
            },
          }),
      },
      from: { type: GraphQLString },
      till: { type: GraphQLString },
      Users: {
        type: new GraphQLList(
          new GraphQLInputObjectType({
            name: "users",
            fields: {
              userId: { type: GraphQLID },
              maxCount: { type: GraphQLInt },
            },
          })
        ),
      },
}
