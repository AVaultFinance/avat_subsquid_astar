import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class PairHourData {
  constructor(props?: Partial<PairHourData>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  hourStartUnix!: bigint

  @Column_("text", {nullable: false})
  pairAddress!: string

  @Column_("text", {nullable: false})
  reserve0!: string

  @Column_("text", {nullable: false})
  reserve1!: string

  @Column_("text", {nullable: false})
  totalSupply!: string

  @Column_("text", {nullable: false})
  reserveUSD!: string

  @Column_("text", {nullable: false})
  hourlyVolumeToken0!: string

  @Column_("text", {nullable: false})
  hourlyVolumeToken1!: string

  @Column_("text", {nullable: false})
  hourlyVolumeUSD!: string

  @Column_("int4", {nullable: false})
  hourlyTxns!: number
}
