import {Id, Timestamp} from '../index';

export type User = {
    id: Id;
    timestamps: Timestamp;
    private_id?: string;
    auth_identifier: string;
    name?: string;
    icon?: string;
    points?: string;
}

