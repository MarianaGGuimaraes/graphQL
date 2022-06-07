import {gql} from 'apollo-server-express';

export const typeDefs = gql`
    type Demand {
        id: ID!
        name: String!
        client: Client!
        dedadline: String!
    }

    #estende o tipo '' adicionar coisas não precisa usar biblioteca que faça merges

    extend type Query {
        demands: [Demand]!
    }
    `;

    export const resolvers = {
        Query: {
            demands: () => []
        },
    };