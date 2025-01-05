

export type Endpoints = ProfileEndpoints | GameEndpoints | LobbyEndpoints;

export type ProfileEndpoints = 'profile.show' | 'profile.create' | 'profile.edit' | 'profile.store';

export type GameEndpoints = 'game.index' | 'game.create' | 'game.store' | 'game.move' | 'game.validate';

export type LobbyEndpoints = 'lobby.index' | 'lobby.create' | 'lobby.store' | 'lobby.match' | 'lobby.join' | 'lobby.disconnect';
