## Introduction

Wiz is a simple CLI based password managers inspired by [Pass](https://www.passwordstore.org). The features are still very minimal, but I planned to add more as I am still learning the language. This is my personal project to learn Deno / Node. You can use it and modify the code if you want to

**Warning:** The encryption is not that secure.

All of the credentials will be saved to
`C:\Users\<username>\AppData\Local\Wiz\<folder_name>\<file_name>.json`

## Installation

1. Make sure you have [Deno](https://docs.deno.com/runtime/manual/getting_started/installation) installed on your machine
2. Clone this repository
3. Create .env file on the root folder
4. Fill the `.env` file with your secret password of choice (make sure it's 16 chars long) like on the `env.example` file
5. run `Deno compile main.ts`, and allow write and read permissions
6. Add compiled file to your Windows PATH executable, you can follow the instruction [here](https://gist.github.com/ScribbleGhost/752ec213b57eef5f232053e04f9d0d54)
7. run `wiz -h` on terminal

## Commads

You need to run `wiz -c` first to create config, then you can run the command below:

-   Create: `wiz -n`
-   Search: ` wiz -s <"search-term">` Searching will be based of folder name, username and or the name of the file
-   generate password: ` wiz -g <"option">` // not yet implemented
-   config: ` wiz -c`
-   help: ` wiz -h`

## Know issues

-   If you input file name with spaces it will be replaced with dash (e.g '2nd account'; will be '2nd-account')
-   Currently only works on Windows (i think)
