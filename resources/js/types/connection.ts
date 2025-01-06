import { GameResponse, PlayerColor, Vector2 } from "./game";

export enum ConnectionState {
    Connected = 'connected',
    Connecting = 'connecting',
    Unavailable = 'unavailable',
    Disconnected = 'disconnected',
}

export type ChannelsMap = {
    [key: `session.${string}`]: ChannelSessionsEventsMap,
    'session': ChannelSessionsEventsMap, // WARN: Not for use, helps display the above typing while... typing.
    [key: `.game.${string}`]: ChannelGameEventsMap,
    '.game': ChannelGameEventsMap,       // WARN: Not for use, helps display the above typing while... typing.

};

export type ChannelSessionsEventsMap = {
    'LoginEvent': LoginEvent,
};

export type ChannelGameEventsMap = {
    'ConnectEvent': ConnectEvent,
    'BoardUpdateEvent': BoardUpdateEvent,
};

export type LoginEvent = {
    'success': boolean,
    'redirect_url': string,
};

export type ConnectEvent = {
    'game_session': GameResponse,
};

export type BoardUpdateEvent = {
    'origin_x': number,
    'origin_y': number,
    'block_positions': Array<Vector2>,
    'player_color': PlayerColor,
    'player_id': string,
}
