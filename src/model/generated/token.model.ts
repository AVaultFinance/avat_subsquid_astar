import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {TokenDayData} from "./tokenDayData.model"
import {PairDayData} from "./pairDayData.model"
import {Pair} from "./pair.model"

@Entity_()
export class Token {
  constructor(props?: Partial<Token>) {
    Object.assign(this, props)
  }

  /**
   * Token Address
   */
  @PrimaryColumn_()
  id!: string

  /**
   * mirrored from the smart contract
   */
  @Column_("text", {nullable: false})
  symbol!: string

  @Column_("text", {nullable: false})
  name!: string

  @Column_("int4", {nullable: false})
  decimals!: number

  /**
   * used for other stats like marketcap
   */
  @Column_("text", {nullable: false})
  totalSupply!: string

  /**
   * token specific volume: BigDecimal
   */
  @Column_("text", {nullable: false})
  tradeVolume!: string

  @Column_("text", {nullable: false})
  tradeVolumeUSD!: string

  @Column_("text", {nullable: false})
  untrackedVolumeUSD!: string

  /**
   * transactions across all pairs
   */
  @Column_("int4", {nullable: false})
  txCount!: number

  /**
   * liquidity across all pairs: BigDecimal
   */
  @Column_("text", {nullable: false})
  totalLiquidity!: string

  /**
   * derived prices: BigDecimal
   */
  @Column_("text", {nullable: false})
  derivedNative!: string

  @OneToMany_(() => TokenDayData, e => e.token)
  tokenDayData!: TokenDayData[]

  @OneToMany_(() => PairDayData, e => e.token0)
  pairDayDataBase!: PairDayData[]

  @OneToMany_(() => PairDayData, e => e.token1)
  pairDayDataQuote!: PairDayData[]

  @OneToMany_(() => Pair, e => e.token0)
  pairBase!: Pair[]

  @OneToMany_(() => Pair, e => e.token1)
  pairQuote!: Pair[]
}
