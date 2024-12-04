import {Id, ForeignId, Timestamp, Timestamps} from '../index';

export type Job = {
    id: Id; 
    queue: string; //* [Index]
    payload: string; 
    attempts: number; 
    reserved_at?: number; 
    available_at: number; 
}

export type Job_batche = {
    id: string; //* [Primary Key]
    name: string; 
    total_jobs: number; 
    pending_jobs: number; 
    failed_jobs: number; 
    failed_job_ids: string; 
    options?: string; 
    cancelled_at?: number; 
    created_at: number; 
    finished_at?: number; 
}

export type Failed_job = {
    id: Id; 
    uuid: string; //* [Unique value]
    connection: string; 
    queue: string; 
    payload: string; 
    exception: string; 
    failed_at: Timestamp; //* [Default value]: Date.now()
}

