import { cmd } from "./src/command.ts";
import { getFlags } from "./src/flags.ts";
import { checkConfig } from "./src/config.ts";

async function main() {
	const args = Deno.args;
	if (args.length === 0) {
		console.log("No flags found, for help type wiz --help");
		return cmd;
	}
	const checkIfConfigExist = await checkConfig();
	if (args[0] === "-c" && checkIfConfigExist === false) {
		return await getFlags();
	} else if (args[0] === "-c" && checkIfConfigExist) {
		console.log("config already exist, please use wiz -c");
		return cmd;
	}
	if (checkIfConfigExist === false) {
		console.log("config not exist, create with wiz -s");
		return cmd;
	}
	return await getFlags();
}

main();
