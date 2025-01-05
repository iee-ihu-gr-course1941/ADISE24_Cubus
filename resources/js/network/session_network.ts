import Network from "."
import { GameResponse } from "@/types/game"


export const getGame = async () => {
    const res = await Network.get<GameResponse>({
        url: route('game.index'),
    })
    return res;
}
