import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {LiquidityPosition} from "./liquidityPosition.model"
import {LiquidityPositionSnapshot} from "./liquidityPositionSnapshot.model"
import {Mint} from "./mint.model"
import {Burn} from "./burn.model"
import {Swap} from "./swap.model"

@Entity_()
export class Pair {
  constructor(props?: Partial<Pair>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  factoryAddress!: string

  @Column_("text", {nullable: false})
  token0Address!: string

  @Column_("text", {nullable: false})
  token1Address!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  reserve0!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  reserve1!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  totalSupply!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  reserveNative!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  reserveUSD!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  trackedReserveNative!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  token0Price!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  token1Price!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  volumeToken0!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  volumeToken1!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  volumeUSD!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  untrackedVolumeUSD!: string

  @Column_("int4", {nullable: false})
  txCount!: number

  @Column_("timestamp with time zone", {nullable: false})
  createdAtTimestamp!: Date

  @Column_("text", {nullable: false})
  createdAtBlockNumber!: string

  @Column_("int4", {nullable: false})
  liquidityProviderCount!: number

  @OneToMany_(() => LiquidityPosition, e => e.pair)
  liquidityPositions!: LiquidityPosition[]

  @OneToMany_(() => LiquidityPositionSnapshot, e => e.pair)
  liquidityPositionSnapshots!: LiquidityPositionSnapshot[]

  @OneToMany_(() => Mint, e => e.pair)
  mints!: Mint[]

  @OneToMany_(() => Burn, e => e.pair)
  burns!: Burn[]

  @OneToMany_(() => Swap, e => e.pair)
  swaps!: Swap[]
}
