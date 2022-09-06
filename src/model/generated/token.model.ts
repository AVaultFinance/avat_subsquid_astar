import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Token {
  constructor(props?: Partial<Token>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  symbol!: string

  @Column_("text", {nullable: false})
  name!: string

  @Column_("int4", {nullable: false})
  decimals!: number

  @Column_("text", {nullable: false})
  totalSupply!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  tradeVolume!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  tradeVolumeUSD!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  untrackedVolumeUSD!: string

  @Column_("int4", {nullable: false})
  txCount!: number

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  totalLiquidity!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  derivedNative!: string
}
