import { Input, Confirm, Secret } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";

export async function getPrompt() {
	const name: string = await Input.prompt({
		message: "What is the name? (special chars and spaces will be transformed into dash):",
		minLength: 2,
	});

	const emailOrUsername = await Input.prompt({
		message: "Username (or email): ",
		minLength: 2,
	});

	const password: string = await Secret.prompt({
		message: "Enter the password: ",
	});

	const folder = await Confirm.prompt("Create a folder? (Will be put in random folder if not specified): ");

	return { name, password, folder, emailOrUsername };
}
