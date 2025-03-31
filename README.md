# Aurora Core

Aurora is the software suite that integrates and synchronizes DMX lighting, narrowcasting screens and currently playing music.
The system is designed around a publish-subscribe architecture.
Executing clients connect to the core using SocketIO Websockets.
End users can send commands to Aurora by using HTTP (in the backoffice).

This repository is the publisher or "core" of the system. All other applications connect to this central hub.
The other repositories can be found here:

- [Aurora Backoffice](https://github.com/gewis/aurora-backoffice).
- [Aurora Narrowcasting Client](https://github.com/gewis/aurora-client).
- [Aurora Audio Player](https://github.com/gewis/aurora-lights-proxy).
- [Aurora DMX Lights Proxy](https://github.com/gewis/aurora-audio-player).

## Prerequisites

- NodeJS 22.

## Installation

1. Copy `.env.example` to `.env` and fill in the environment variables.
2. Run `yarn install`.
3. Run `yarn dev`.
4. The application is now running at http://localhost:3000. The API documentation can be found at http://localhost:3000/api-docs.

Authentication is done using Keycloak (OIDC). However, while in development mode you can also use the `/auth/mock` endpoint to mock a Keycloak authentication.

To get started more easily, you can seed the database with GEWIS's setup using `yarn seed`.
You can then find the API keys for all the subscribers in the `api_key` SQL table.

### Integration with external services

To fully utilize all functionality of Aurora, some extra environment variables are required:

- To use Spotify integration, create an app in the [Spotify Developer dashboard](https://developer.spotify.com/dashboard).
- To use the narrowcasting poster screen, create a Trello board and have a [Trello API Key and Token](https://developer.atlassian.com/cloud/trello/guides/rest-api/authorization/#passing-token-and-key-in-api-requests).
- To use the "train departures" poster on the narrowcasting poster screen, you need an [NS](https://ns.nl) key.
- To use GEWIS photos on the narrowcasting poster screen, you need an internal GEWIS website token.
- To use SudoSOS borrel posters, you need at least a [SudoSOS API key](https://github.com/GEWIS/sudosos-backend).

## Deployment

Aurora can easily be deployed by using Docker Compose. Note that this only includes the core, backoffice and narrowcasting client.
The audio player and DMX lights proxy need to be installed manually onto their destined systems, as those applications require an audio output and connected ARTnet controller respectively.

## Copyright

Copyright © 2023-2024 Study Association GEWIS - Some rights reserved.
You can use our software freely within the limits of our license.
However, we worked very hard on this project and invested a lot of time in it
so we ask you to leave our copyright marks in place when modifying our software.
Of course, you are free to add your own.

## License

Aurora uses the AGPL-3.0 license.
