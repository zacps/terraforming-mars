import * as http from "http";
import { Handler } from "./Handler";
import { Context } from "./IHandler";
import { GameId, isGameId, PlayerId } from "../../common/Types";
import { Cloner } from "../database/Cloner";
import { Server } from "../models/ServerModel";
import { Player } from "../Player";

export class ApiForkGame extends Handler {
  public static readonly INSTANCE = new ApiForkGame();
  private constructor() {
    super();
  }

  // Copied from GameHandler
  private generateRandomId(prefix: string): string {
    // 281474976710656 possible values.
    return (
      prefix +
      `-clone-` +
      Math.floor(Math.random() * Math.pow(16, 12)).toString(16)
    );
  }

  public override async get(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    ctx: Context
  ): Promise<void> {
    const gameId = ctx.url.searchParams.get("id");
    if (gameId === null) {
      ctx.route.badRequest(req, res, "missing id parameter");
      return;
    }
    if (!isGameId(gameId)) {
      ctx.route.badRequest(req, res, "invalid game id");
      return;
    }

    const game = await ctx.gameLoader.getGame(gameId);
    if (!game) {
      ctx.route.notFound(req, res, "game not found");
      return;
    }

    const existingPlayersInOrder = game.getPlayersInGenerationOrder();
    const seedNewPlayers = existingPlayersInOrder.map((player) => {
      const newPlayerId = this.generateRandomId(player.id) as PlayerId;
      return new Player(
        player.name,
        player.color,
        player.beginner,
        player.handicap,
        newPlayerId
      );
    });

    const newGameId: GameId = this.generateRandomId(game.id) as GameId;
    const clonedGame = Cloner.clone(
      newGameId,
      seedNewPlayers,
      0,
      game.serialize()
    );

    // Not async for some reason?
    clonedGame.save();

    // Required to update the participants cache (otherwise moves will fail to find the game).
    // Doesn't appear to write to the database.
    await ctx.gameLoader.add(clonedGame);

    const gamePlayers = clonedGame.getPlayersInGenerationOrder();
    const playerIdMapping = existingPlayersInOrder.reduce((acc, p, idx) => {
      acc[p.id] = gamePlayers[idx].id;
      return acc;
    }, {} as Record<PlayerId, PlayerId>);

    const gameModel = Server.getGameModel(clonedGame);
    const simplePlayerModels = Server.getSimpleGameModel(clonedGame).players;

    ctx.route.writeJson(res, {
      players: simplePlayerModels,
      playerIdMapping: playerIdMapping,
      game: gameModel,
      gameId: clonedGame.id,
    });
  }
}
