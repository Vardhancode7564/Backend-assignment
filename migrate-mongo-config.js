require("dotenv").config();

const config = {
  mongodb: {
    url: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/contact-management",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // The migrations dir, can be an relative or absolute path
  migrationsDir: "migrations",

  // The mongodb collection where the applied migration info will be stored
  changelogCollectionName: "changelog",

  // The file extension to create migrations and files to search for in migration dir
  migrationFileExtension: ".js",

  // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determine
  // if the file should be run. Requires that scripts are not modified once they are run.
  useFileHash: false,

  // Don't change this, unless you know what you're doing
  moduleSystem: "commonjs",
};

module.exports = config;
