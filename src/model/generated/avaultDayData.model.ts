import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class AvaultDayData {
  constructor(props?: Partial<AvaultDayData>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("timestamp with time zone", {nullable: false})
  date!: Date

  @Column_("text", {nullable: false})
  dailyVolumeNative!: string

  @Column_("text", {nullable: false})
  dailyVolumeUSD!: string

  @Column_("text", {nullable: false})
  dailyVolumeUntracked!: string

  /**
   * Accumulate at each trade, not just calculated off whatever totalVolume is, making it more accurate as it is a live conversion
   */
  @Column_("text", {nullable: false})
  totalVolumeUSD!: string

  @Column_("text", {nullable: false})
  totalVolumeNative!: string

  @Column_("text", {nullable: false})
  totalLiquidityNative!: string

  @Column_("text", {nullable: false})
  totalLiquidityUSD!: string

  @Column_("int4", {nullable: false})
  txCount!: number
}
