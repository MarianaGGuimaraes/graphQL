import {gql} from 'apollo-server-express';

 export const typeDefs = gql `
interface List {
    items: [Node!]! #o uso da ! fora signif que o valor [node!] não é nulável e a de dentro signigica que o node não é nulável
    totalItems: Int!
        }
    enum ListSortmentEnum{
        ASC  #ascendente
        DESC
    }

    input ListSort{
        sorter: String! #ordenador
        sortment: ListSortmentEnum!   #ordenação
    }
    `;

    export const ListSortmentEnum = Object.freeze ({
        ASC: 'ASC',
        DESC: 'DESC',
    });

    export const resolvers = {
        List: {
            __resolveType: () => null,
        },
    };