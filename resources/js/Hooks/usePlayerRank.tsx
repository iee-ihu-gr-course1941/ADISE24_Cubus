import {COLORS} from '@/Constants/colors';
import {useAppState} from '@/Store/app_state';
import {useBoardState} from '@/Store/board_state';
import {PlayerColor} from '@/types/game';
import {useMemo} from 'react';

export const usePlayerRank = () => {
    const session = useAppState(s => s.currentSession);
    const playerState = useBoardState(s => s.playerState);

    const position = useMemo(() => {
        const playerColor = playerState?.session_color;
        const playerPoints = playerColor
            ? (session?.[`player_${playerColor}_points`] ?? 0)
            : 0;
        let playerPosition = 1;
        Object.keys(COLORS).forEach(color => {
            if (color !== playerColor) {
                const opponentPoints =
                    session?.[`player_${color as PlayerColor}_points`] ?? 0;
                if (opponentPoints > playerPoints) {
                    playerPosition = playerPosition + 1;
                }
            }
        });
        return playerPosition;
    }, [session, playerState]);
    return {
        rank: position,
        isWin: position === 1,
        label:
            position === 1
                ? '1st'
                : position === 2
                  ? '2nd'
                  : position === 3
                    ? '3rd'
                    : '4th',
    };
};
