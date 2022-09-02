import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {LiquidityPosition} from "./liquidityPosition.model"
import {User} from "./user.model"
import {Pair} from "./pair.model"

@Entity_()
export class LiquidityPositionSnapshot {
  constructor(props?: Partial<LiquidityPositionSnapshot>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => LiquidityPosition, {nullable: false})
  liquidityPositions!: LiquidityPosition

  /**
   * Saved for fast historical lookups
   */
  @Column_("timestamp with time zone", {nullable: false})
  timestamp!: Date

  /**
   * Saved for fast historical lookups
   */
  @Column_("int4", {nullable: false})
  block!: number

  /**
   * Reference to user
   */
  @Index_()
  @ManyToOne_(() => User, {nullable: false})
  user!: User

  @Index_()
  @ManyToOne_(() => Pair, {nullable: false})
  pair!: Pair

  /**
   * Snapshot of token0 price: BigDecimal
   */
  @Column_("text", {nullable: false})
  token0PriceUSD!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  token1PriceUSD!: string

  /**
   * Snapshot of pair token0 reserves: BigDecimal
   */
  @Column_("text", {nullable: false})
  reserve0!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  reserve1!: string

  /**
   * Snapshot of pair reserves in USD: BigDecimal
   */
  @Column_("text", {nullable: false})
  reserveUSD!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  liquidityTokenTotalSupply!: string

  /**
   * Snapshot of users pool token balance: BigDecimal
   */
  @Column_("text", {nullable: false})
  liquidityTokenBalance!: string
}
