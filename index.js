const debug = true;
if(!debug) var tracer = require('dd-trace').init()
if(debug) var auth = require('../tokens/scuttester-auth.json');
else var auth = require('../tokens/owo-auth.json');

const config = require('./src/data/config.json');
const request = require('./utils/request.js');
const Sharder = require('eris-sharder').Master;
var result,shards,firstShardID,lastShardID;

if(require('cluster').isMaster){
	const global = require('./utils/global.js');
	const RamCheck = new (require('./utils/ramCheck.js'))(global);
}

const totalShards = 10;

(async () => {
	try{
		if (!debug&&require('cluster').isMaster){
			result = await request.fetchInit();
			console.log(result);
			shards = parseInt(result["shards"]);
			firstShardID = parseInt(result["firstShardID"]);
			lastShardID = parseInt(result["lastShardID"]);
		}
		var clusters = Math.ceil(shards/totalShards);
		if(debug){
			shards = 1;
			firstShardID = 0;
			lastShardID = 1;
			clusters = 1
		}

		console.log("Creating shards "+firstShardID+"~"+lastShardID+" out of "+shards+" total shards!");

		const sharder = new Sharder("Bot "+auth.token, config.sharder.path, {
			name: config.sharder.name,
			clientOptions: config.eris.clientOptions,
			debug:true,
			shards,clusters,
			firstShardID,
			lastShardID,
		});

	}catch(e){
		console.error("Failed to start eris sharder");
		console.error(e);
	}
})();
