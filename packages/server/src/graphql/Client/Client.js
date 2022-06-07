import{ gql} from 'apollo-server-express' //gql é a função que conseguimos construir queries na sintaxe do graphql dentro do js. 
import * as uuid from 'uuid';
import createRepository from '../../io/Database/createRepository';
import { ListSortmentEnum } from '../List/list';
//Usa a estrutura de função para template string

const clientRepository = createRepository('client');

export const typeDefs = gql`
type Client {
    id: ID!
    name: String!
    email: String!
    disabled: Boolean!
}
type ClientList implements List {
    items: [Client!]!
    totalItems: Int!
}

input ClientListFilter{
    name: String
    email: String
    disabled: Boolean
}
input ClientListOptions {
    take: Int
    skip: Int
    filter: ClientListFilter
    sort: ListSort

}

extend type Query{
    client(id:ID!):Client
    clients (options: ClientListOptions): ClientList
}
input CreateClientInput{
    name:String!
    email: String!
}
input UpdateClientInput{
    id: ID!
    name:String!
    email: String!
}

extend type Mutation{
    createClient(input: createClientInput!): Client!
    updateClient(input: UpdateClientInput!): Client!
    deleteClient(id: ID!): Client!
    enableClient(id: ID!): Client!
    disableClient(id: ID!): Client!
}
`;

export const resolvers = { //todo resolve no graphql recebe 4 parãmetros, o primeiro é ligado ao parent que traz argumentos dos dados retornados pela query anterior
    //o segundo é o argumento. no nosso caso é o ID, objeto que tem id. o terceiro é um contexto (que não está sendo usado agora) e o último é o info (traz o st inteiro da query - também não está sendo usado)
       Query:{
        client: async (_, { id }) => { //uma função asyn geralmente retorna uma Promise não precisa usar o async, mas se quiser pode dar um await nos dados
            const clients = await createRepository.read (); 
            return clients.find((client) => client.id === id);
        },
        clients: async (_, args) => {
            const{
                skip = 0,
                take = 10,
                sort     
            }  = args.options || {}; //uma função asyn geralmente retorna uma Promise não precisa usar o async, mas se quiser pode dar um await nos dados
            
            /**
             * @type {Array<*>}
             */
            
            const clients = await createRepository.read (); 

            if (sort) {
                clients.sort((clientA, clientB) => {
                    if(!['name', 'email', 'disabled'].includes(sort.sorter))
                        throw new Error(`Cannot sort by field "${sort.sorter}".`);

                    const fieldA = clientA[sort.sorter];
                    const fieldB = clientB[sort.sorter];

                    if(typeof fieldA === 'string') {
                        if (sort.sortment === ListSortmentEnum.ASC)
                            return fieldA.localeCompare(fieldB);
                        else return fieldB.localeCompare(fieldA);
                    }

                        if (sort.sortment === ListSortmentEnum.ASC)
                            return Number(fieldA) - Number(fieldB);
                        else return Number(fieldB) - Number(fieldA);
                    });
            }

            const filteredClients = clients.filter((client)=> {
                if(!filter || Object.keys(filter).length === 0)
                    return true;

                return Object.entries(filter).every(([field, value]) => {
                    if (client[field] === null || client[field] === undefined) 
                    return false;
                    if(typeof value === 'string') {
                        if (value.startsWith('%') && value.endsWith('%'))
                            return client[field].includes(value.substr(1, value.length -2));
                        if(value.startsWith('%'))
                            return client[field].endsWith(value.substr(1));
                        if(value.endsWith('%'))
                            return client [field].startsWith(value.substr(0, value.length - 1)
                            );
                        return client[field] === value;
                    }
                    return client[field] === value;
                });
            });
            return {
                items: filteredClients.slice (skip, skip + take),
                totalItems: filteredClients.length,
            };
        },
    },

        Mutation: {
        createClient: async(_, {input}) =>{
            const clients = await clientRepository.read();

            const client = {
                id: uuid.v4(),
                name: input.name,
                email: input.email, 
                disabled: false,
            };

            await clientRepository.write([...clients, client]);
            return client;
        },

        updateClient: async(_, {input})=>{
            const clients = await clientRepository.read();

            const currentClient = clients.find((client) => client.id === input.id);

            if (!currentClient)
            throw new Error (`No client with this id "${input.id}"`);

            const updatedClient = {
                ...currentClient,
                name: input.name,
                email: input.email, 
            };

            const updatedClients = clients.map((client)=> {
                if (client.id === updatedClient.id) return updatedClient;
                return client;
            });
    
            await clientRepository.write([updatedClients]);

            return updatedClient;
        },

        deleteClient: async (_, {id}) => {
                const clients = await clientRepository.read();

                const client = clients.find((client) => client.id === id);

                if (!client) 
                    throw new Error(`Cannot delete client with id "${id}"`);

                const updatedClients = clients.filter((client) => client.id !== id);

                await clientRepository.write(updatedClients);

             return client;
    },
        enableClient: async (_,{id}) => {
         const clients = await clientRepository.read();

        const currentClient = clients.find((client) => client.id === id);

        if (!currentClient) throw new Error(`No client with this id "${id}"`);

        if (!currentClient.disabled)
        throw new Error(`Client "${id}" is already enabled.`);

        const updatedClient = {
        ...currentClient,
        disabled: false,
      };
      
      const updatedClients = clients.map((client) => {
        if (client.id === updatedClient.id) return updatedClient;
        return client;
      });

      await clientRepository.write(updatedClients);

      return updatedClient;
    },

    disableClient: async (_, { id }) => {
        const clients = await clientRepository.read();
  
        const currentClient = clients.find((client) => client.id === id);
  
        if (!currentClient) throw new Error(`No client with this id "${id}"`);
  
        if (currentClient.disabled)
          throw new Error(`Client "${id}" is already disabled.`);
  
        const updatedClient = {
          ...currentClient,
          disabled: true,
        };
  
        const updatedClients = clients.map((client) => {
          if (client.id === updatedClient.id) return updatedClient;
          return client;
        });
  
        await clientRepository.write(updatedClients);
  
        return updatedClient;
      },
    },
  };

