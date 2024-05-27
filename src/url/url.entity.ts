import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  longUrl: string;

  @Column({ unique: true })
  shortUrl: string;

  @Column()
  hash: string;

  @Column()
  visited: number;
}
