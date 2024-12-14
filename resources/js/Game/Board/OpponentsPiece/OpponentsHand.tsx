import { useBoardState } from "@/Store/board_state";
import { useGameDimensions } from "@/Store/game_dimensions";
import { OpponentMovePayload } from "@/types/piece";
import { useControls } from "leva";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { OpponentPiece } from "./OpponentPiece";

export const OpponentsHand = () => {
    const [occupations, setOccupations] = useState<OpponentMovePayload[]>([]);
    const state = useBoardState(state => state.gameState.state);

    useEffect(() => {

        if(state === 'OpponentTurn'){
            const opponentMovePayload: OpponentMovePayload = {
                block_positions: [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: -1}],
                destination: {x: Math.random() < 0.5 ? -2 : 2, y: Math.random() < 0.5 ? -2 : 2},
                opponent: 'green',
            }
            setOccupations([...occupations, opponentMovePayload])
        }

    }, [state])

    return (
        <>
            {
                occupations.map((movement, index) => {
                    return (
                        <OpponentPiece key={index} {...movement}/>
                    )
                })
            }
        </>
    );
}
