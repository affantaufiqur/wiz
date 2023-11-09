// generate password

type GeneratePasswordType = {
	lowercase?: boolean;
	uppercase?: boolean;
	numbers?: boolean;
	symbols?: boolean;
};

const charactersSet = {
	alphabet: "abcdefghijklmnopqrstuvwxyz",
	numbers: "0123456789",
	symbols: "!@#$%^&*()_+-={}[]|:;<>,.?/~",
	all: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-={}[]|:;<>,.?/~",
} as const;

function generatePassword(length: number, options: GeneratePasswordType = {}): string {
	let password = "";

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charactersSet.all.length);
		password += charactersSet.all[randomIndex];
	}

	return password;
}

const password = generatePassword(24); // Generate a password with a length of 24
console.log(password); // Output the generated password
