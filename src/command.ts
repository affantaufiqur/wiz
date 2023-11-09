import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";

export const cmd = await new Command()
	.name("wiz")
	.version("0.0.1")
	.description("This is CLI Tools for managing passwords")
	.option("-n, --new", "Create a new entry")
	.option("-s, --search <name:string>", "Search for folder or name of the credentials")
	.option("-c, --config", "Create a new config file")
	.parse();
