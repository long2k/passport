const   express = require('express');
const router = express.Router();
const  elastic =require('elasticsearch');
const  bodyParser =require('body-parser').json();

import {AergoClient, Contract} from '@herajs/client';
const aergo = new AergoClient();
const   contractAbi = require('./contract.abi.json');
const contract = Contract.fromAbi(contractAbi).setAddress(contractAddress);


const elasticClient= elastic.Client({
    host:'localhost:9200',
})

// check Ping
elasticClient.ping({
    requestTimeout:1000

},function (err) {
    if (err) {
        console.error("elasticClient is down");        
    } else {
        console.log("All is well");
    }
});
// function insert data in elasticsearch
const  insertDoc = async function(_id, mappingType, data) {
    return await elasticClient.index({
        index:'trans',
        type: mappingType,
        id: _id,
        body: data,
    })  
}

router.get('/transaction/:id', async (req,res)=>{
    try {
        let {acc,mapp,data} = req.body;
        if(!acc) {
           return  res.badRequest();
        }
        const callTx = contract.someContractMethod().asTransaction({
            from: req.params('id')
        });
        const calltxhash = await aergo.accounts.sendTransaction(callTx);
        const calltxreceipt = await aergo.getTransactionReceipt(calltxhash);
        if(calltxreceipt) {
              await insertDoc(acc,mapp,data);
              res.status(200).json({msg:"Thanh cong "})
        }  
    } catch (error) {
        return res.status(404).json({
           msg:"failed"
        });
    }
})
module.exports = router;