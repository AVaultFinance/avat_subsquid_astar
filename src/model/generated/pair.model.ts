import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Token} from "./token.model"

@Entity_()
export class Pair {
  constructor(props?: Partial<Pair>) {
    Object.assign(this, props)
  }

  /**
   * pair address + time(YYYY-MM-DD)
   */
  @PrimaryColumn_()
  id!: string

  /**
   * mirrored from the smart contract
   */
  @Index_()
  @ManyToOne_(() => Token, {nullable: false})
  token0!: Token

  @Index_()
  @ManyToOne_(() => Token, {nullable: false})
  token1!: Token

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
}
