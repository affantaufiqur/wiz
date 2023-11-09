import { indexIntoDb } from "./walk.ts";
import MiniSearch from "npm:minisearch@6.1.0";

type reducuRetunType = {
	folderName: string;
	filesInDirectory: string[];
};

export const windowsPath = Deno.env.get("LOCALAPPDATA");
export const FILE_PATH = `${windowsPath}\\wiz\\`;

const index = await indexIntoDb();

const miniSearch = new MiniSearch({
	fields: ["name", "folder", "username"],
	storeFields: ["name", "folder"],
});

miniSearch.addAll(index);

export function search(searchTerm: string) {
	const query = miniSearch.search(searchTerm);
	const combinedData = query.reduce<reducuRetunType[]>((acc, obj) => {
		const sameFolderName = acc.find((item) => item.folderName === obj.folder);
		if (sameFolderName) {
			sameFolderName.filesInDirectory.push(`${obj.folder}/${obj.name}`);
		} else {
			acc.push({ folderName: obj.folder, filesInDirectory: [`${obj.folder}/${obj.name}`] });
		}
		return acc;
	}, []);

	return { query, combinedData };
}
