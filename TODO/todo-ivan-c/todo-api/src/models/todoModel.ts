import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./userModel";

@Table({
  timestamps: true,
})
export class Todo extends Model {
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  description!: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}
