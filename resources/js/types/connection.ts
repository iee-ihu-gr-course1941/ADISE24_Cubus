import { Game_session } from "./models/tables/Session";

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
    'game_session': Game_session,
};

export type BoardUpdateEvent = {
    'valid': boolean,
    'origin_x': number,
    'origin_y': number,
    'piece_positions': {x: number, y: number}[],
    'player_color': string,
    'player_id': string,
}
