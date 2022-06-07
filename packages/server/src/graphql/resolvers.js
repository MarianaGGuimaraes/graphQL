import { resolvers as nodeResolvers } from './Node/Node';
import { resolvers as listResolvers } from './List/list';
import { resolvers as clientResolvers } from './Client/Client';
import {resolver as demandResolvers} from './Demand/Demand';

const resolvers = {
    ...nodeResolvers,
    ...listResolvers,
    ...clientResolvers,
    ...demandResolvers,


    Query: {
        ...clientResolvers,
        ...demandResolvers.Query,

    },

    Mutation: {
        ...clientResolvers.Mutation,
    }
};

export default resolvers;