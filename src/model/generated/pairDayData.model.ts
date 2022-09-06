import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class PairDayData {
  constructor(props?: Partial<PairDayData>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("timestamp with time zone", {nullable: false})
  date!: Date

  @Column_("text", {nullable: false})
  pairAddress!: string

  @Column_("text", {nullable: false})
  token0Address!: string

  @Column_("text", {nullable: false})
  token1Address!: string

  @Column_("text", {nullable: false})
  reserve0!: string

  @Column_("text", {nullable: false})
  reserve1!: string

  @Column_("text", {nullable: false})
  totalSupply!: string

  @Column_("text", {nullable: false})
  reserveUSD!: string

  @Column_("text", {nullable: false})
  dailyVolumeToken0!: string

  @Column_("text", {nullable: false})
  dailyVolumeToken1!: string

  @Column_("text", {nullable: false})
  dailyVolumeUSD!: string

  @Column_("int4", {nullable: false})
  dailyTxns!: number
}
