import { GraphQLObjectType, GraphQLSchema } from "graphql"
import * as adminGraph from "./graphQL/admin/graph.controller.js"

export const graphSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "socialAppQuery",
        description: "main app query",
        fields: {
            ...adminGraph.query
        }
    })
})