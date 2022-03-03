import { ethers, hardhatArguments } from "hardhat";
import fs from "fs";

async function main() {
  if (!hardhatArguments.network) {
    throw new Error("Unknown network");
  }

//   fs.writeFileSync(`${hardhatArguments.network}-address.txt`, card.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
