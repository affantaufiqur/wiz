// import { getAllFiles } from "../src/walk.ts";
import { walk } from "https://deno.land/std@0.204.0/fs/mod.ts";

export const windowsPath = Deno.env.get("LOCALAPPDATA");
export const FILE_PATH = `${windowsPath}/wiz/`;

export function sanitizeFileName(fileName: string): string {
	const notAllowedChars = /[\<>:"\/\\|?*]/g; // Regular expression to match not allowed characters in windows file naming system
	const spaceChar = /\s/g; // Regular expression to match space character

	// Replace not allowed characters and space with a dash
	const sanitizedFileName = fileName.replace(notAllowedChars, "-").replace(spaceChar, "-");

	return sanitizedFileName;
}

export async function getAllFilesAndFolders(folderPath: string) {
	const files: { path: string; name: string; isFile: boolean; isDirectory: boolean; isSymlink: boolean }[] = [];

	for await (const entry of walk(folderPath, { includeFiles: true, includeDirs: true })) {
		files.push(entry);
	}

	return files.map((file) => {
		return {
			path: file.path,
			name: file.name,
			isFile: file.isFile,
			isDirectory: file.isDirectory,
			isSymlink: file.isSymlink,
		};
	});
}

export async function checkIfFilenameAlreadyExists(filename: string, folderName: string) {
	const files = await getAllFilesAndFolders(FILE_PATH);
	const fileNameWithExt = `${filename}.json`;

	const checkFileName = files.filter((file) => file.name === fileNameWithExt);
	const result = checkFileName
		?.map((fileDetail) => {
			const splitPath = fileDetail.path.split("\\");
			const index = splitPath.findIndex((row) => row.includes(folderName));
			if (index !== -1) {
				return splitPath;
			}
		})
		.filter(Boolean);

	if (result && result.length > 0) {
		return true;
	} else {
		return false;
	}
}

console.log(await checkIfFilenameAlreadyExists("main", "github"));
