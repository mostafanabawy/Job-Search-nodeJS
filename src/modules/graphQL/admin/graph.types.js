import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { userType } from "./graphTypes/userTypes.js";
import { companyType } from "./graphTypes/companyType.js";

const UserDataType = new GraphQLObjectType({
    name: "userData",
    fields: {
        users: { type: new GraphQLList(userType) }
    }
});
const CompanyDataType = new GraphQLObjectType({
    name: "companyData",
    fields: {
        companies: { type: new GraphQLList(companyType) }
    }
});

export const AllDataType = new GraphQLObjectType({
    name: "allData",
    fields: {
        message: { type: GraphQLString },
        status: { type: GraphQLInt },
        data: { type: UserDataType }  // ✅ Reference the separate object
    }
});
export const AllCompaniesType = new GraphQLObjectType({
    name: "allCompanyData",
    fields: {
        message: { type: GraphQLString },
        status: { type: GraphQLInt },
        data: { type: CompanyDataType }  // ✅ Reference the separate object
    }
});