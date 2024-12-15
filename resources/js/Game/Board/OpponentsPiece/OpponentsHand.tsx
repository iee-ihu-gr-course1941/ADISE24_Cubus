import { useBoardState } from "@/Store/board_state";
import { useGameDimensions } from "@/Store/game_dimensions";
import { OpponentMovePayload, PieceCode, Vector2 } from "@/types/piece";
import { useControls } from "leva";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { OpponentPiece } from "./OpponentPiece";
import { PiecePositions } from "@/Constants/Piece";

export const OpponentsHand = () => {
    const [occupations, setOccupations] = useState<OpponentMovePayload[]>([]);
    const state = useBoardState(state => state.gameState.state);
    const blockSize = useGameDimensions(state => state.blockSize);

    useEffect(() => {

        if(state === 'OpponentTurn'){
            //* Generate a random opponent move for demo
            const randomX = Math.round((((Math.random() - 0.5) * 10)) / blockSize) * blockSize;
            const randomY = Math.round((((Math.random() - 0.5) * 10)) / blockSize) * blockSize;
            const opponentMovePayload: OpponentMovePayload = {
                block_positions: PiecePositions[occupations.length as PieceCode],
                destination: {x: randomX, y: randomY},
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
