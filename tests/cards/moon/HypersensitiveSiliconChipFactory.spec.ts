import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {setCustomGameOptions} from '../../TestingUtils';
import {HypersensitiveSiliconChipFactory} from '../../../src/server/cards/moon/HypersensitiveSiliconChipFactory';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('HypersensitiveSiliconChipFactory', () => {
  let player: TestPlayer;
  let card: HypersensitiveSiliconChipFactory;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, MOON_OPTIONS);
    card = new HypersensitiveSiliconChipFactory();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    const space1 = moonData.moon.getAvailableSpacesOnLand(player)[0];
    const space2 = moonData.moon.getAvailableSpacesOnLand(player)[1];

    space1.tile = {tileType: TileType.MOON_MINE};
    space2.tile = {tileType: TileType.MOON_MINE};

    player.titanium = 2;
    player.production.override({energy: 2});
    expect(player.getPlayableCards()).does.include(card);

    player.titanium = 1;
    player.production.override({energy: 2});
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 2;
    space2.tile = {tileType: TileType.MOON_COLONY};
    player.production.override({energy: 1});
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.production.override({megacredits: 0});
    player.titanium = 2;

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.production.megacredits).eq(4);
  });
});

