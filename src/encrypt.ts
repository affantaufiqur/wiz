import { decodeHex as hd, encodeHex as he } from "https://deno.land/std@0.204.0/encoding/hex.ts";
import { load } from "https://deno.land/std@0.205.0/dotenv/mod.ts";

const encodeText = (text: string) => new TextEncoder().encode(text);
const decodeText = (bytes: Uint8Array) => new TextDecoder().decode(bytes);

await load({ export: true });
const SECRET_PASSWORD = Deno.env.get("SECRET_PASSWORD");
if (!SECRET_PASSWORD) throw new Error("SECRET_PASSWORD is not defined, please defined them in the .env file");
const superSecretKey = SECRET_PASSWORD;

const encode = encodeText(superSecretKey);
const algorithm = {
	name: "AES-CBC",
	length: 128,
};

const cryptoKey = await crypto.subtle.importKey("raw", encode, algorithm, true, ["encrypt", "decrypt"]);

export async function encrypt(text: string) {
	const encrypted = await crypto.subtle.encrypt({ name: "AES-CBC", iv: encode }, cryptoKey, encodeText(text));
	const encryptedBytes = new Uint8Array(encrypted);
	return he(encryptedBytes);
}

export async function decrypt(encryptedData: string) {
	const decrypted = await crypto.subtle.decrypt({ name: "AES-CBC", iv: encode }, cryptoKey, hd(encryptedData));
	const decryptedBytes = new Uint8Array(decrypted);
	return decodeText(decryptedBytes);
}
