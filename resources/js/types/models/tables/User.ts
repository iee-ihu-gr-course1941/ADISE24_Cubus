import {Id, ForeignId, Timestamp, Timestamps} from '../index';

export type User = {
    id: Id;
    timestamps: Timestamp;
    private_id?: string;
    auth_identifier: string;
    name?: string;
    icon?: string;
}

