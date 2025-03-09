import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLID,
} from "graphql";

// Import types but don't reference them yet
import { jobType } from "./jobType.js";

const userType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString },
    isConfirmed: { type: GraphQLBoolean },
    isBanned: { type: GraphQLBoolean },
    isDeleted: { type: GraphQLBoolean },
    profilePic: {
      type: new GraphQLObjectType({
        name: "ProfilePic",
        fields: {
          secure_url: { type: GraphQLString },
          public_id: { type: GraphQLString },
        },
      }),
    },
    coverPic: {
      type: new GraphQLObjectType({
        name: "coverPic",
        fields: {
          secure_url: { type: GraphQLString },
          public_id: { type: GraphQLString },
        }
      })
    }
  }),
});

export { userType };
