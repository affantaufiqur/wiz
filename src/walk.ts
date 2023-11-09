import { walk } from "https://deno.land/std@0.204.0/fs/mod.ts";
import { extname } from "https://deno.land/std@0.204.0/path/mod.ts";

export const windowsPath = Deno.env.get("LOCALAPPDATA");
export const FILE_PATH = `${windowsPath}/wiz/`;

// getting all of data inside the files
export async function getAllFiles(folderPath: string): Promise<string[]> {
	const files: string[] = [];

	for await (const entry of walk(folderPath, { includeFiles: true, includeDirs: false })) {
		if (extname(entry.path) === ".json" && entry.name !== "config.json") {
			files.push(entry.path);
		}
	}

	return files;
}

const files = await getAllFiles(FILE_PATH);

export async function indexIntoDb() {
	const document = [];
	for (const file of files) {
		const fileContent = await Deno.readTextFile(file);
		document.push(JSON.parse(fileContent));
	}
	return document;
}
