import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {StagingStationBehemoth} from '../../../src/server/cards/moon/StagingStationBehemoth';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {IMoonData} from '../../../src/server/moon/IMoonData';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('StagingStationBehemoth', () => {
  let player: Player;
  let card: StagingStationBehemoth;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, MOON_OPTIONS);
    card = new StagingStationBehemoth();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    moonData.logisticRate = 0;
    expect(player.colonies.getFleetSize()).to.eq(1);

    card.play(player);

    expect(moonData.logisticRate).eq(1);
    expect(player.colonies.getFleetSize()).to.eq(3);
    expect(player.getTerraformRating()).eq(15);
  });
});

