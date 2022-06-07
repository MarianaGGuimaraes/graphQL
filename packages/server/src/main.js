//import {createServer} from 'http'; //para criar servidor  -- não será mais usado após a instalação do express
//import { readFile } from 'fs'; //para processar o html
//import { resolve } from 'path'; 
// import {parse} from 'querystring'; -- não será mais usado após a instalação do express
//roteamento é quando tem mais de uma forma acessar serviço de API e terá rotas para isso. Pode-se ter rotas dentro de rotas. ex: google.com/ (rota/), google.com/home (rota home)

import express from 'express'; //o express implementa uma camada por cima do creater server do htttp ou https
//import cors from 'cors';
import {ApolloServer} from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

const app = express();
//cód abaixo já em graphql

const PORT = process.env.PORT ? parseInt(process.env.PORT) :8000;
const HOSTNAME = process.env.HOSTNAME || '192.168.0.231';

async function startServer() {
	const server = new ApolloServer({
		plugins: [
			ApolloServerPluginLandingPageGraphQLPlayground(),
		],
		typeDefs,
		resolvers,
	});

	await server.start();

server.applyMiddleware({
    app,
    cors: {
        origin: `http://${HOSTNAME}:3000`,
},
    bodyParserConfig: true, //antes tinha o express.jsn, como agora não tem o graphql não interpretaria direito. Então passa o bodyParser com true.
});
};
// opção para instalar o cors server.use(cors());


/*server.get('/status', (_, response) => {//requisição feita pelo método get 
//middler manipula padrões que estao vindo e consegue colocar em sequência para que rodem em fila
    response. send({
        status: 'Okay',
    });
});
const enableCors = cors({origin: 'http://localhost:3000'});
server
    .options('/authenticate', enableCors)
    .post (
    '/authenticate', 
    express.json(), 
    (request, response) => {
        console.log(
        'E-mail', request.body.email,
        'Senha', request. body. password
    );
    response.send({
        Okay: true,
    });
});*/

//o express consegue tratar requisições com erro, então não necessitaremos da parte de defaul.
//foi implementado apenas para não gerar erro no browser antes e ficar aguardando uma resposta que não viria. 
/*const server = createServer ((request, response) => { //const para guardar o server e request/response para tratar as requisições 
    switch(request.url){ 
        case '/status': {  //n]ão é necessária mais essa parte após inserir o express
            response.writeHead(200, {
                'Content-Type': 'application/json',  //header é tipo de conteúdo
            });
            response.write( //tem que colocar json (objeto) com função stringify para gerar o json em strings
                JSON.stringify({
                    status:'Okay',
                })
            );
            response.end();
            break;
        }
        case 'sing-in': {
            const path = resolve (__dirname,'./pages/sign-in.html'); 
            //não vai conseguir llocalizar o arquivo, pois o node faz o caminho não a partir do main, mas a partir da raiz do projeto;. Por isso usaremos import path 
            //o dirname é comum em js e injetará em cada módulo o diretório em cada módulo está
            readFile(path, (error, file) =>{
                if(error){
                response.writeHead(500, 'Can\'t process HTML file');
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file);
            response.end();
        });
        break;
    }
        case 'home': {
        const path = resolve (__dirname,'./pages/home.html'); 
        readFile(path, (error, file) =>{
            if(error){
            response.writeHead(500, 'Can\'t process HTML file');
            response.end();
            return;
        }

        response.writeHead(200);
        response.write(file);
        response.end();
    });
    break;
}
        case '/authenticate':{ //para processar o request como buffer usar um pattern de eventos (usar 'data') 
            let data = ''; //usar o let pq vai ser uma variável que irei modificar. 
            request.on('data', (chunk) =>{ //vai ler de pouco em pouco
                data += chunk; 
            });
            request.on('end', ( ) =>{ //aqui termina de ler o arquivo
                const params = parse(data);
                //console.log(parse(data));
                /*response.writeHead(301, {
                    Location: '/home',
                });
                response.end();
            });
            break;
        
        }
        default:{
            response.writeHead(404, 'Service not found.');
            response.end();
        } //por causa do switch e é usado para qualquer coisa que não se encaixe nos casos acima
    }
});*/

//configurar porta e host name. Pode ser que tenhamos mais deuma aplicação ou server rodando ou que precise configurar para funcionar em um determinado momento.
startServer(app);

app.listen(PORT, HOSTNAME, () => {
    console.log(`Server listening at ${HOSTNAME}:${PORT}`);
});
   //process é variável global do node. o env é um objeto com variáveis de ambiente. 
  //hostname já é string então não faz sentido fazer parse
 //funçãl listen, recebe alguns argumentos
