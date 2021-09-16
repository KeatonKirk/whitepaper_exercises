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

var difficulty = 10;

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

for (let line of poem) {
	let bl = createBlock(line);
	Blockchain.blocks.push(bl);
	console.log(`Hash (Difficulty: ${difficulty}): ${bl.hash}`);

	difficulty++;
}


// **********************************

function createBlock(data) {
	var bl = {
		index: Blockchain.blocks.length,
		prevHash: Blockchain.blocks[Blockchain.blocks.length-1].hash,
		data,
		timestamp: Date.now(),
		nonce: 0,
	};

	bl.hash = blockHash(bl);
	// Log each created block :) 
	console.log(bl)
	return bl;
}

function blockHash(bl) {
	 // takes block as input
	 // apply sha256 to the block, including nonce (start as 0)
	 // run hash through hashIsLowEnough
	 // return the hashed, output (encoded in hexadecimal format?)
	 // NOTE* added nonce element above.
	 let hash = crypto.createHash("sha256").update (
		 JSON.stringify(bl)
	 ).digest("hex");
		let validHash = hashIsLowEnough(hash)
	while (validHash != true){
		// increment nonce
		bl.nonce++;
		// recompute block hash
		hash = crypto.createHash("sha256").update (JSON.stringify(bl)).digest("hex");
		// recompute hashIsLowEnough
		validHash = hashIsLowEnough(hash);
	};
	 return hash;
}

function hashIsLowEnough(hash) {
	// Comparing hex strings
	// one hexidecimal digit = 4 bytes
	// number of leading zeros = difficutly / 4
	let numChars = Math.ceil(difficulty / 4);
	let hashCheck = '0';
	hashCheck = hashCheck.padStart(numChars, '0');
	if ( hash.substr(0, numChars) != hashCheck) return false
	
	return true
}

function verifyBlock(bl) {
	if (bl.data == null) return false;
	if (bl.index === 0) {
		if (bl.hash !== "000000") return false;
	}
	else {
		if (!bl.prevHash) return false;
		if (!(
			typeof bl.index === "number" &&
			Number.isInteger(bl.index) &&
			bl.index > 0
		)) {
			return false;
		}
		if (bl.hash !== blockHash(bl)) return false;
	}

	return true;
}

function verifyChain(chain) {
	var prevHash;
	for (let bl of chain.blocks) {
		if (prevHash && bl.prevHash !== prevHash) return false;
		if (!verifyBlock(bl)) return false;
		prevHash = bl.hash;
	}

	return true;
}
