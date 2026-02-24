import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column()
    content: string

    @Column({unique: true})
    slug: string

    @ManyToOne(() => User, (user) => user.posts, {
        onDelete: 'CASCADE'
    })
    author: User

    @CreateDateColumn()
    createdAt: Date
}
