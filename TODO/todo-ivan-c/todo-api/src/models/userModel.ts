import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  HasMany,
} from "sequelize-typescript";
import { Todo } from "./todoModel";

@Table({
  timestamps: true,
})
export class User extends Model {
  @Unique
  @Column(DataType.STRING)
  email!: string;

  @Unique
  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  password!: string;

  @HasMany(() => Todo)
  todos!: Todo[];
}
