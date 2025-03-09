import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID,
  } from "graphql";
  
  // Import types but use lazy evaluation
  import { userType } from "./userTypes.js";
  import { companyType } from "./companyType.js";
  
  const jobType = new GraphQLObjectType({
    name: "Job",
    fields: () => ({
      id: { type: GraphQLID },
      jobTitle: { type: GraphQLString },
      jobLocation: { type: GraphQLString },
      workingTime: { type: GraphQLString },
      seniorityLevel: { type: GraphQLString },
      jobDescription: { type: GraphQLString },
      technicalSkills: { type: new GraphQLList(GraphQLString) },
      softSkills: { type: new GraphQLList(GraphQLString) },
    }),
  });
  
  export { jobType };
  