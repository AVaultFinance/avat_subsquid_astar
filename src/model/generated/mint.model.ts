import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Transaction} from "./transaction.model"
import {Pair} from "./pair.model"

@Entity_()
export class Mint {
  constructor(props?: Partial<Mint>) {
    Object.assign(this, props)
  }

  /**
   * Transaction hash + '-' + index in mints Transaction array
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Transaction, {nullable: false})
  transaction!: Transaction

  /**
   * Need this to pull recent txns for specific token or pair
   */
  @Column_("timestamp with time zone", {nullable: false})
  timestamp!: Date

  @Index_()
  @ManyToOne_(() => Pair, {nullable: false})
  pair!: Pair

  /**
   * Populated from the primary Transfer event
   */
  @Column_("text", {nullable: false})
  to!: string

  @Column_("text", {nullable: false})
  liquidity!: string

  /**
   * Populated from the Mint event
   */
  @Column_("text", {nullable: true})
  sender!: string | undefined | null

  @Column_("text", {nullable: false})
  amount0!: string

  @Column_("text", {nullable: false})
  amount1!: string

  @Column_("int4", {nullable: true})
  logIndex!: number | undefined | null

  /**
   * Derived amount based on available prices of tokens
   */
  @Column_("text", {nullable: true})
  amountUSD!: string | undefined | null

  /**
   * Optional fee fields, if a Transfer event is fired in _mintFee
   */
  @Column_("text", {nullable: true})
  feeTo!: string | undefined | null

  @Column_("text", {nullable: true})
  feeLiquidity!: string | undefined | null
}
