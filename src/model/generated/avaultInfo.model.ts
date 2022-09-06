import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Factory} from "./factory.model"
import {StableSwapInfo} from "./stableSwapInfo.model"

@Entity_()
export class AvaultInfo {
  constructor(props?: Partial<AvaultInfo>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("timestamp with time zone", {nullable: false})
  updatedDate!: Date

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  totalVolumeUSD!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  totalTvlUSD!: string

  @Column_("int4", {nullable: false})
  txCount!: number

  @Index_()
  @ManyToOne_(() => Factory, {nullable: false})
  factory!: Factory

  @Index_()
  @ManyToOne_(() => StableSwapInfo, {nullable: false})
  stableSwapInfo!: StableSwapInfo
}
