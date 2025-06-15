import { Entity, Column, BeforeInsert, AfterLoad } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from 'src/common/base-entity';

@Entity()
export class User extends BaseEntity{

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', nullable: true, length: 512})
  refreshToken: string | null;

  @Column({ type: 'varchar', nullable: true, length: 512 })
  token: string | null;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(inputPwd: string) {
    return bcrypt.compare(inputPwd, this.password);
  }
}