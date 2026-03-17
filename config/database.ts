import path from "path";

export default ({ env }) => {
  const filename = env("DATABASE_FILENAME", ".tmp/data.db");

  return {
    connection: {
      client: "sqlite",
      connection: {
        filename: path.isAbsolute(filename)
          ? filename
          : path.join(process.cwd(), filename),
      },
      useNullAsDefault: true,
    },
  };
};
