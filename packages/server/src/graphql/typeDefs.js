import {gql} from 'apollo-server-express';

import { typeDefs as nodeTypeDefs } from './Node/Node';
import { typeDefs as listTypeDefs } from './List/List';
import {typeDefs as clientTypeDefs} from './Client/Client';
import {typeDefs as demandTypeDefs} from './Demand/Demand';

//type defs global abaixo. É preciso implementar um tipo qry. É preciso concatenar.
//a ordem das coisas abaixo tem que vir na ordem como estão sendo declaradas
//é preciso um type qry com root (strng) para poder estender no demand typedfs um qry que já existe. o graphql não deixa implementar vazio
const typeDefs = gql`
    type Query {
        _root: String
    }

    type Mutation {
        _root: string
    }
    ${nodeTypeDefs}
    ${listTypeDefs}
    ${clientTypeDefs}
    ${demandTypeDefs}
    `;

    export default typeDefs;
