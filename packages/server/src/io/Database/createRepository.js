import { read, readFile, writeFile} from 'fs';
import {resolve} from 'path';
import { stringify } from 'querystring';

function createRepository (name){
    const path = resolve(__dirname, `../../data/${name}.json`)

    return {
        read: () => new Promise((resolve, reject) => { //promise gera resolve e reject
            readFile(path, (error, data)=> {
                if (error){
                    reject (error);
                    return;
                }

                resolve(JSON.parse(data));
            })
        }),

        write: (data) => 
            new Promise ((resolve, reject) => {
                writeFile(path, JSON.stringify(data), (error)=> {
                    if (error){
                        reject (error);
                        return;
                    }
    
                    resolve();
                });
            }),
        };
    }

    export default createRepository;