# Cubus

**Cubus** is a Blockus game where a group of two or four players take turns to capture as much of the board as possible. The following implementation uses Laravel to create a **strong and extensive backend** that communicates using a REST API but also WebSockets, adding a touch of **real-time responsiveness** in the exchange of information. We managed our frontend using React to create a **reactive experience** for the user to enjoy.

## Rules Overview
The game is played over a 20x20 grid when there are four players and a 14x14 grid when two are playing. Each player has 21 distinct pieces which they can place in the board in a interesting way:
- The first move **MUST** be in one of the four edges.
- Each move after that must touch corners with another piece of the same color but it cannot touch anywhere else.

A game continues up unti no player can place any more pieces. Either because they don't have any left or because there is no more space in the board.

The winner is the person with the most points which are calculated by the pieces on the board. A player get's extra points if he places all his pieces down, but also gets extra points if his last piece was the single squared piece.

## Features
- Breathtaking hand crafted 2D & 3D art.
- RESTFUL API
- Realtime gameplay using WebSockets.

## REST API
THe API manages information about the user, lobbies and also the game. Below we can see an overview of the endpoints. The naming conventions and methods used in the structure are based on Laravel conventions.
| Resource | Endpoint             | Method | Description |
|----------|----------------------|--------|-------------------|
| User     | /apps-login-callback | GET    | Redirect url after a successful APPS login |
| User     | /mock-login/{id}     | GET    | A test login endpoint to assist in the development and showcasing process |
| User     | /profile             | GET    | Retrieve user information |
| User     | /profile             | POST   | Store and Update user information |
| User     | /profile/logout      | GET    | Initiate the user logout process |
| Lobby    | /lobby               | GET    | Retrieve information about available lobbies |
| Lobby    | /lobby/current       | GET    | Get the current joined lobby's information |
| Lobby    | /lobby               | POST   | Create a new lobby |
| Lobby    | /lobby/match         | GET    | Join a random lobby |
| Lobby    | /lobby/{id}/join     | GET    | Join the lobby with {id} |
| Lobby    | /lobby/disconnect    | GET    | Disconnect from the lobby |
| Game     | /game                | GET    | Get the current game information |
| Game     | /game/move           | POST   | Attempt to play a move |
| Game     | /game/validate       | POST   | Check if a move is valid without playing it |

## WebSocket API
Our WebSocket API is primarily used to update the players of changes. The players don't directly communicate over the WebSocket channels as the game is turn based and it wouldn't be as optimal as the current structure because:
- There would be extra overhead during user request management, which translates to more code for the same result.
- The game doesn't benefit from a snappier experience, as it's a turn based strategy game.

Our API consists of three Events that each user listens for:
| Event Name | Initiation Reason | Description |
|------------|-------------------|-------------|
| Login      | User connected using apps | The IEE Account login flow has the user navigate outside of our game, thus we need a way to confirm that he is logged in and return him gracefully with the least amount of tabs |
| Connect    | User connects in a lobby  | The rest of the users receive a message showing the current state of the lobby |
| BoardUpdate | User places a piece | It contains information about the game as well as the move so we can display the action in real time |

## Development without docker
Make sure your `.env` is configured to run with an sqlite instance `DB_CONNECTION=sqlite`. Then you can run
```sh
composer run dev
```

> [!NOTE]
> If this is the first time you're running the server use `php artisan migrate` to generate the db tables.


## Development with docker
Make sure you have `docker` and `docker compose` installed. If you haven't, check [the docker installation guide](https://docs.docker.com/engine/install/#supported-platforms) and [the docker compose installation guide](https://docs.docker.com/compose/install/linux/).

Then the only thing you need to run is
```sh
composer run dev-docker
```

> [!NOTE]
> If this is the first time you're running the server use `vendor/bin/sail artisan migrate`

