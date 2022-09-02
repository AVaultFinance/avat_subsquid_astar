import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Pair} from "./pair.model"

@Entity_()
export class PairHourData {
  constructor(props?: Partial<PairHourData>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  /**
   * Unix timestamp for start of hour
   */
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  hourStartUnix!: bigint

  @Index_()
  @ManyToOne_(() => Pair, {nullable: false})
  pair!: Pair

  /**
   * Reserves
   */
  @Column_("text", {nullable: false})
  reserve0!: string

  @Column_("text", {nullable: false})
  reserve1!: string

  /**
   * total supply for LP historical returns
   */
  @Column_("text", {nullable: false})
  totalSupply!: string

  /**
   * derived liquidity
   */
  @Column_("text", {nullable: true})
  reserveUSD!: string | undefined | null

  /**
   * volume stats
   */
  @Column_("text", {nullable: false})
  hourlyVolumeTolen0!: string

  @Column_("text", {nullable: false})
  hourlyVolumeTolen1!: string

  @Column_("text", {nullable: false})
  hourlyVolumeUSD!: string

  @Column_("int4", {nullable: false})
  hourlyTxns!: number
}
