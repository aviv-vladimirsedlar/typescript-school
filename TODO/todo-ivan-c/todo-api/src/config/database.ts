import { Sequelize } from "sequelize-typescript";

// Use SQLite in-memory for testing, otherwise use MySQL
export const sequelize = new Sequelize({
  dialect: process.env.NODE_ENV === "test" ? "sqlite" : "mysql",
  storage: process.env.NODE_ENV === "test" ? ":memory:" : undefined,
  host: process.env.NODE_ENV === "test" ? undefined : "localhost",
  username: process.env.NODE_ENV === "test" ? undefined : "root",
  password: process.env.NODE_ENV === "test" ? undefined : "`,R3H/!o",
  database: process.env.NODE_ENV === "test" ? undefined : "todo_api",
  models: [__dirname + "/../models"],
  modelMatch: (filename, member) => {
    return (
      filename.substring(0, filename.indexOf("Model")) === member.toLowerCase()
    );
  },
});
