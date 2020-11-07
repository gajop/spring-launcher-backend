## Setup

```sh
# Install dependencies
npm install

# Create a new GitHub app at https://github.com/settings/apps/
# Download the private key and setup .env

# Run the bot
npm start
```

## Run builder

`node src/builder/run_builder.js`

Optionally, to clear the CDN cache on new builds, put `CDN_ID` in .env.
The CDN ID can be obtained by running the following command: `doctl compute cdn list --format ID --no-header`.

## Make builds

To make builds without uploading them, you can use the `run_build` command as:

`node src/builder/run_build.js $my_github_repository_full_name`

Example:

`node src/builder/run_build.js gajop/test-repo`

## License

[ISC](LICENSE) © 2018 Gajo Petrovic <gajopetrovic@gmail.com>
