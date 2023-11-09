import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";

export const windowsPath = Deno.env.get("LOCALAPPDATA");
export const FILE_PATH = `${windowsPath}\\wiz`;

export async function createConfig(pin: string) {
	const toWrite = {
		pin,
	};
	try {
		await Deno.writeTextFile(`${FILE_PATH}\\config.json`, JSON.stringify(toWrite));
		return console.log(colors.bold.green("Config created"));
	} catch (e) {
		console.error(e);
	}
}

export async function readConfig() {
	const readConfig = await Deno.readTextFile(`${FILE_PATH}\\config.json`);
	return JSON.parse(readConfig);
}

export async function checkConfig() {
	try {
		return await Deno.stat(`${FILE_PATH}\\config.json`);
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) {
			return false;
		} else {
			throw error;
		}
	}
}
