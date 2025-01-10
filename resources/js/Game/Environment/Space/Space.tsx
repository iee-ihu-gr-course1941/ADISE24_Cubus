import {memo} from 'react';
import {Stars} from './Stars';
import {Planets} from './Planets';

export const Space = memo(() => {
    return (
        <>
            <Stars />
            <Planets />
        </>
    );
});
