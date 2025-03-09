import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLID,
} from "graphql";

// Import types but avoid direct references initially
import { userType } from "./userTypes.js";

const companyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLID },
    companyName: { type: GraphQLString },
    description: { type: GraphQLString },
    industry: { type: GraphQLString },
    address: { type: GraphQLString },
    numberOfEmployees: { type: GraphQLString },
    companyEmail: { type: GraphQLString },
    isBanned: { type: GraphQLBoolean },
    approvedByAdmin: { type: GraphQLBoolean },
    logo: {
      type: new GraphQLObjectType({
        name: "logoPic",
        fields: {
          secure_url: { type: GraphQLString },
          public_id: { type: GraphQLString },
        },
      }),
    }, // Deferred reference
    logo: {
      type: new GraphQLObjectType({
        name: "logoPic",
        fields: {
          secure_url: { type: GraphQLString },
          public_id: { type: GraphQLString },
        },
      }),
    },
    coverPic: {
      type: new GraphQLObjectType({
        name: "companyCoverPic",
        fields: {
          secure_url: { type: GraphQLString },
          public_id: { type: GraphQLString },
        },
      }),
    },
  }),
});

export { companyType };
