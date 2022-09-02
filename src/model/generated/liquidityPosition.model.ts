import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {User} from "./user.model"
import {Pair} from "./pair.model"

@Entity_()
export class LiquidityPosition {
  constructor(props?: Partial<LiquidityPosition>) {
    Object.assign(this, props)
  }

  /**
   * pair.id-user.id
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => User, {nullable: false})
  user!: User

  @Index_()
  @ManyToOne_(() => Pair, {nullable: false})
  pair!: Pair

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  liquidityTokenBalance!: string
}
