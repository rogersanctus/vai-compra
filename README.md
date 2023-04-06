# Vai Compra
An e-commerce made with NextJS 13, Tailwindcss and a few other libraries. Made from 'zero'.

## Setting up
This project will run as both backend and frontend server. To the backend get to work properly, you need to setup some environment variables. The instructions bellow are for a Development mode environment.

You will need openssl installed and have its binaries path added to your PATH system environment variable.

_Part of the instructions on this documentation applies only for Linux bash shell. If you are using Windows/Mac terminal, please use the corresponding versions of each command._

### Install dependencies
You need NodeJS on version 18 LTS to run this project well. Not tested with other verions.
The first step ever is to install the dependencies. Do that by running:

```bash
npm i
```

### Database
The database used in this project is PostgreSQL. To run a fresh cloned project you must setup the environment and run some preparation commands.

Setup the environment by creating or editing a .env file. You can also set those variables into you system, if wantted.

```
# Into the .env file (must be in the root of the project)
DATABASE_URL="postgresql://db_user:db_password@localhost:5432/vai-compra?schema=public"
```

> Please replace `db_user` by your PostgreSQL user name and the `db_password` by your password. The default values on a fresh PostgreSQL tends to be: `db_user: 'postgres' and db_password: 'postgres'`.

Now you can run the command:

```bash
npx prisma migrate dev
```

Your database may be now created and the migrations done.

One last step is to generate the prisma client runtime. Run the command bellow.

```bash
npx prisma generate
```

### JWT Tokens
create a Private and a Public RSA key. Those will be used to sign and verify JWT tokens for User authentication system. You can generate them with:

```bash
# The application expects the keys to be priv.key and pub.key

# private key
openssl genrsa -out temp.key 2048
# and public key (the priv key must be created first)
openssl pkey -in temp.key -pubout -out pub.key
# then, generate the pkcs8 key from the temp.key
openssl pkcs8 -topk8 -nocrypt -in temp.key -out priv.key
# and finally delete the temp.key
rm temp.key
```

Those commands will generate a pair of keys with the RS256 as algorithm. You must set this in your environment. You can set it with .env files. For example, create or edit a .env.local file with this content:

```
RSA_ALG=RS256
```

NextJS will automatically load .env files into the `Environment`.

Yet for the Authentication system, you must setup a CRYPTO_SALT key. Its recommended to be a key with at least 32 bytes of size. Generate one with:

```bash
openssl rand -base64 32
```

Copy the result and paste it as a new entry in the .env.local file as:

```
CRYPTO_SALT=THE_RETURN_FROM_THE_COMMAND_ABOVE
```

> Please remmember to replace the text `THE_RETURN_FROM_THE_COMMAND_ABOVE` with the output from the openssl rand command.

### A setting example:

There is a .env.example file with all needed variables. If you want you can copy it with the name .env and set it.

## Finally Running the application

And to run run the server run:

```bash
npm run dev
```

That command will serve both the API and the frontend for the application.

If the command above runs well, open your Browser and navigate to: [http://localhost:3000](http://localhost:3000)
