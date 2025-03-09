import { getAllCompanies, getAllUsers } from "./graph.service.js";
import { AllCompaniesType, AllDataType } from "./graph.types.js";


export const query = {
    getAllUsers: {
        type: AllDataType,
        resolve: getAllUsers
    },
    getAllCompanies: {
        type: AllCompaniesType,
        resolve: getAllCompanies
    }
};


