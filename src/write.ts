type Created = {
	username: string;
	folder: string;
	password: string;
};

export async function makeDir(path: string, options?: Deno.MkdirOptions) {
	try {
		await Deno.mkdir(path, options);
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
}

export async function writeIntoJson(filePath: string, data: Created) {
	try {
		await Deno.writeTextFile(filePath, JSON.stringify(data));
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
}
