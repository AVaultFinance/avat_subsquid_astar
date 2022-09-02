import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Bundle {
  constructor(props?: Partial<Bundle>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  /**
   * Price of ETH usd: BigDecimal
   */
  @Column_("text", {nullable: false})
  nativePrice!: string
}
