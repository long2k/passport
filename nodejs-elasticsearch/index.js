import { AergoClient } from '@herajs/client';
import es from 'elasticsearch';

let aergo = new AergoClient();


let esClient = new  es.Client({
    host :'localhost:9200',
    log: 'trace'
})
esClient.ping({
    requestTimeout:1000
}, function (error ) {
    if(error ) {
        console.trace("elastisearch cluster is down");
    } else {
        console.log('All is well');
    }
})
const insertData = async function(data) {
    return await esClient.index({
        index: 'trans',
        type: Date.now(),
        body: data
    });
} 
let pastHeight,currentHeight;
    aergo.blockchain().then(blockchainState =>{
        pastHeight = blockchainState.bestHeight;
    })
setInterval(async function(){
     currentHeight = (await aergo.blockchain()).bestHeight;
    if( currentHeight > pastHeight) {
        for(var  i = pastHeight+1 ; i<= currentHeight;i++) {
            insertData(await (aergo.getBlock(i)));
            pastHeight = currentHeight;
        }
    }
},3000)

