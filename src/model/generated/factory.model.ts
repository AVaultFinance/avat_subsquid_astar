import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Factory {
  constructor(props?: Partial<Factory>) {
    Object.assign(this, props)
  }

  /**
   * Factory address
   */
  @PrimaryColumn_()
  id!: string

  /**
   * pair info
   */
  @Column_("int4", {nullable: false})
  pairCount!: number

  /**
   * total volume: BigDecimal
   */
  @Column_("text", {nullable: false})
  totalVolumeUSD!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  totalVolumeNative!: string

  /**
   * Untracked values: BigDecimal
   */
  @Column_("text", {nullable: false})
  untrackedVolumeUSD!: string

  /**
   * total liquidity: BigDecimal
   */
  @Column_("text", {nullable: false})
  totalLiquidityUSD!: string

  @Column_("text", {nullable: false})
  totalLiquidityNative!: string

  /**
   * transactions
   */
  @Column_("int4", {nullable: false})
  txCount!: number
}
