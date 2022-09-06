import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Transaction {
  constructor(props?: Partial<Transaction>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  blockNumber!: string

  @Column_("timestamp with time zone", {nullable: false})
  timestamp!: Date

  @Column_("text", {array: true, nullable: false})
  mints!: (string)[]

  @Column_("text", {array: true, nullable: false})
  burns!: (string)[]

  @Column_("text", {array: true, nullable: false})
  swaps!: (string)[]
}
