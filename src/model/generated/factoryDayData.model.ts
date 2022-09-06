import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class FactoryDayData {
  constructor(props?: Partial<FactoryDayData>) {
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

  @Column_("text", {nullable: false})
  totalVolumeNative!: string

  @Column_("text", {nullable: false})
  totalLiquidityNative!: string

  @Column_("text", {nullable: false})
  totalVolumeUSD!: string

  @Column_("text", {nullable: false})
  totalLiquidityUSD!: string

  @Column_("int4", {nullable: false})
  txCount!: number
}
