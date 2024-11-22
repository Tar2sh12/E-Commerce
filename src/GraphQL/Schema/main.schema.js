import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";
import { listProducts, createCoupon } from "../Resolvers/index.js";
import { productType, CouponType, CouponArgs } from "../Types/index.js";
export const mainSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQuery",
    description: "this is root query",
    fields: {
      sayHello: {
        name: "sayHello",
        description: "hello",
        type: GraphQLString,
        resolve: () => {
          return "hi from graphql";
        },
      },
      returnObject: {
        name: "return object",
        description: "{}",
        type: new GraphQLObjectType({
          name: "object",
          description: "message && status code",
          fields: {
            message: { type: GraphQLString },
            statusCode: { type: GraphQLInt },
          },
        }),
        resolve: () => {
          return {
            message: "my msg",
            statusCode: 200,
          };
        },
      },
      sendData: {
        name: "send me args",
        description: "hi args",
        type: GraphQLString,
        args: {
          name: { type: GraphQLString },
          age: { type: new GraphQLNonNull(GraphQLInt) },
        },
        resolve: (parent, args) => {
          return `hi ${args.name} ur age = ${args.age} `;
        },
      },
      getProducts: {
        name: "get products",
        description: "get products",
        type: new GraphQLList(productType),
        resolve: listProducts,
      },
    },
  }),

  mutation: new GraphQLObjectType({
    name: "RootMutation",
    description: "this is root mutation",
    fields: {
      createCoupon: {
        name: "createcoupon",
        description: "create coupon",
        type: CouponType,
        args: CouponArgs,
        resolve: createCoupon,
      },
    },
  }),
});
