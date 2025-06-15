import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity {
    protected constructor(input?: Partial<BaseEntity>) {
        if (input) {
            for (const [key, value] of Object.entries(input)) {
                (this as any)[key] = value;
            }
        }
    }

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn() createdDate: Date;

    @UpdateDateColumn() updatedDate: Date;
}
