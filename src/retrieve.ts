import { parse } from "https://deno.land/std@0.204.0/flags/mod.ts";
import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/select.ts";
import { Table } from "https://deno.land/x/cliffy@v1.0.0-rc.3/table/mod.ts";
import { search } from "./search.ts";
import { decrypt } from "./encrypt.ts";

type returnFileContent = {
	id: string;
	username: string;
	password: string;
	folder: string;
	name: string;
};

export const windowsPath = Deno.env.get("LOCALAPPDATA");
export const FILE_PATH = `${windowsPath}\\wiz`;

export async function selectAndReadFile() {
	const { s: name } = parse(Deno.args);

	if (!name) {
		console.log(
			"Please provide the search term using the -s flag, e.g., `wiz -g gmail` use quoute if need to use space, e.g., `wiz -s 'work account'"
		);
		return;
	}

	const { combinedData } = search(name.toLocaleLowerCase());

	if (combinedData.length === 0) {
		console.log("No matches found");
		return Deno.exit(1);
	}

	const transform = combinedData.map((file) => ({
		name: file.folderName,
		options: file.filesInDirectory,
	}));

	const result = await Select.prompt({
		message: "Please select: ",
		options: transform,
	});

	const coercedResult = result as unknown as string;
	const [folderName, fileName] = coercedResult.split("/");

	const filePath = `${FILE_PATH}\\${folderName}\\${fileName}.json`;
	const fileContent = await Deno.readTextFile(filePath);
	const parseContent = JSON.parse(fileContent) as returnFileContent;
	return new Table()
		.header(["username or email", "password", "folder", "name"])
		.body([
			[
				`${parseContent.username}`,
				`${await decrypt(parseContent.password)}`,
				`${parseContent.folder}`,
				`${parseContent.name}`,
			],
		])
		.padding(2)
		.border()
		.render();
}
