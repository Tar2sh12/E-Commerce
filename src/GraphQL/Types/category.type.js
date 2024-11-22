import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

export const CategoryType = new GraphQLObjectType({
  name: "categoryType",
  description: "this is category type",
  fields: {
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    slug: { type: GraphQLString },
    customId: { type: GraphQLString },
    Images: {
      type: new GraphQLObjectType({
        name: "image",
        fields: {
          secure_url: { type: GraphQLString },
          public_id: { type: GraphQLString },
        },
      }),
    },
  },
})
