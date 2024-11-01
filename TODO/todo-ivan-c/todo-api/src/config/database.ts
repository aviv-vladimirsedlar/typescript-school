import { Sequelize } from "sequelize-typescript";

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "`,R3H/!o",
  database: "todo_api",
  models: [__dirname + "/../models"],
  modelMatch: (filename, member) => {
    return (
      filename.substring(0, filename.indexOf("Model")) === member.toLowerCase()
    );
  },
});
