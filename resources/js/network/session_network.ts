import Network from '.';
import {GameResponse, MovePayload, MoveResponse} from '@/types/game';

export const getGame = async () => {
    const res = await Network.get<GameResponse>({
        url: route('game.index'),
    });
    return res;
};

export const validateMove = async (move: MovePayload) => {
    const res = await Network.post<MoveResponse>({
        url: route('game.move'),
        body: move,
    });
    return res;
};
