const {ethers, run, network} = require("hardhat");

async function main(){
	const SimpleStorageFactory = await ethers.getContractFactory(
	"SimpleStorage"
	);

	console.log("Deploying contract...");
	const simpleStorage = await SimpleStorageFactory.deploy();
	await simpleStorage.deployed();
	console.log(`Deployed contracct to: ${simpleStorage.address}`);

	if(network.config.chainId===4 && process.env.ETHERSCAN_API_KEY){
	    console.log("Waiting for block confirmation.");
		await simpleStorage.deployTransaction.wait(2);
		await verify(simpleStorage.address, []);
	}

	const currentValue = await simpleStorage.retrieve();
	console.log(`Current Value is:  ${currentValue}`);
	
	//Update current value

	const transactionResponse = await simpleStorage.store("7");
	await transactionResponse.wait(1);
	const upadateValue = await simpleStorage.retrieve();
	console.log(`Update Value is ${upadateValue}`);
}

async function verify(contractAddress, args){
	console.log("Verifying contract...");
	try{
		await run("verify:verify", {
			address: contractAddress,
			constructorArguments: args,
		});
	}catch(e){
		if(e.message.toLowerCase().includes("already verified")){
			console.log("Already Verified!")
		}else{
			console.log(e);
		}
	}
}

main()
	.then(()=>process.exit(0))
	.catch((error) => {
	console.error(error);
	process.exit(1);
	});