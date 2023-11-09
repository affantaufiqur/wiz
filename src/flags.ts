import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";
import { parseFlags, ValidationError } from "https://deno.land/x/cliffy@v1.0.0-rc.3/flags/mod.ts";
import { Input, Secret } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { uuidv7 } from "npm:uuidv7@0.6.3";
import { checkIfFilenameAlreadyExists, sanitizeFileName } from "../utils/fileUtils.ts";
import { createConfig } from "./config.ts";
import { getPrompt } from "./prompt.ts";
import { selectAndReadFile } from "./retrieve.ts";
import { makeDir, writeIntoJson } from "./write.ts";

const windowsPath = Deno.env.get("LOCALAPPDATA");

export async function getFlags() {
	try {
		const { flags } = parseFlags(Deno.args, {
			flags: [
				{
					name: "new",
					aliases: ["n"],
				},
				{
					name: "search",
					aliases: ["s"],
				},
				{
					name: "config",
					aliases: ["c"],
				},
			],
			allowEmpty: false,
		});

		if (flags.new) {
			const promptResult = await getPrompt();

			// if user select no folder
			if (!promptResult.folder) {
				const entry = {
					id: uuidv7(),
					username: promptResult.emailOrUsername,
					password: promptResult.password,
					folder: "random",
					name: sanitizeFileName(promptResult.name).toLocaleLowerCase(),
				};
				await makeDir(`${windowsPath}/wiz/random`, { recursive: true });
				const checkFileAndFolder = await checkIfFilenameAlreadyExists(entry.name, "random");

				if (!checkFileAndFolder) {
					try {
						await writeIntoJson(
							`${windowsPath}/wiz/random/${sanitizeFileName(promptResult.name)}.json`,
							entry
						);
						return console.log(colors.bold.green("New entry created"));
					} catch (e) {
						return console.error(e);
					}
				} else {
					return console.error(colors.bold.red("Filename already exist within given folder"));
				}
			} else {
				// if user select to create folder
				const folderName: string = await Input.prompt({
					message: "Folder name: ",
					minLength: 2,
				});

				const entry = {
					id: uuidv7(),
					username: promptResult.emailOrUsername,
					password: promptResult.password,
					folder: folderName.toLocaleLowerCase(),
					name: sanitizeFileName(promptResult.name).toLocaleLowerCase(),
				};

				await makeDir(`${windowsPath}/wiz/${folderName.toLocaleLowerCase()}`, { recursive: true });
				const checkFileAndFolder = await checkIfFilenameAlreadyExists(
					entry.name,
					entry.folder.toLocaleLowerCase()
				);
				if (!checkFileAndFolder) {
					try {
						await writeIntoJson(
							`${windowsPath}/wiz/${folderName}/${sanitizeFileName(promptResult.name)}.json`,
							entry
						);
						return console.log(colors.bold.green("New entry created"));
					} catch (e) {
						return console.error(e);
					}
				} else {
					return console.error(colors.bold.red("Filename already exist within given folder"));
				}
			}
		}

		if (flags.search) {
			return await selectAndReadFile();
		}

		if (flags.config) {
			const pin: string = await Secret.prompt({
				message: "Enter you pin: ",
				minLength: 6,
				maxLength: 6,
			});
			return await createConfig(pin);
		}
	} catch (error) {
		if (error instanceof ValidationError) {
			console.error("[VALIDATION_ERROR] %s", error.message);
			Deno.exit(1);
		}
	}
}
