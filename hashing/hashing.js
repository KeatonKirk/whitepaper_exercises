"use strict";

var crypto = require("crypto");

// The Power of a Smile
// by Tupac Shakur
var poem = [
	"The power of a gun can kill",
	"and the power of fire can burn",
	"the power of wind can chill",
	"and the power of a mind can learn",
	"the power of anger can rage",
	"inside until it tears u apart",
	"but the power of a smile",
	"especially yours can heal a frozen heart",
];

var Blockchain = {
	blocks: [],
};

// Genesis block
Blockchain.blocks.push({
	index: 0,
	hash: "000000",
	data: "",
	timestamp: Date.now(),
});

// TODO: insert each line into blockchain




const createBlock = (line) => {
    let previousBlock = Blockchain.blocks.at(-1);
    let block = {
        index: (Blockchain.blocks.length),
        prevHash: previousBlock.hash,
        data: line,
        timestamp: Date.now()
    };
    block.hash = blockHash(block);
    return block;
};

for (let line of poem) {
    let block = createBlock(line);
    Blockchain.blocks.push(block);
};

const verifyChain = (blockchain) => {
    let valid = false;
    
    for (let block of Blockchain.blocks) {
        let previousBlock = Blockchain.blocks[(block.index -1)];
        let hashable = Object.assign({}, block)
        if (block.index != 0) {delete hashable.hash}
        if (block.index === 0 && block.hash === "000000") {
            valid = true;
        }else if (block.data && block.prevHash && block.index >= 0 && blockHash(hashable) === block.hash && block.prevHash == previousBlock.hash) {
            valid = true;
        }else { 
            valid = false;
            break;
        }
    }
    return valid;
};
console.log(Blockchain);
console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`);


// ********************************** // 

function blockHash(block) {
	return crypto.createHash("sha256").update(
		JSON.stringify(block)
	).digest("hex");
}
