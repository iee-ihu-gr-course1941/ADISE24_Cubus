import {Id, ForeignId, Timestamp, Timestamps} from '../index';

export type Cach = {
    key: string; //* [Primary Key]
    value: string; 
}

export type Cache_lock = {
    key: string; //* [Primary Key]
    owner: string; 
}

