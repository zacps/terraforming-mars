import {expect} from 'chai';
import {EarthOffice} from '../../../src/server/cards/base/EarthOffice';
import {Sponsors} from '../../../src/server/cards/base/Sponsors';
import {SaturnSurfing} from '../../../src/server/cards/promo/SaturnSurfing';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('SaturnSurfing', function() {
  let card: SaturnSurfing;
  let player: Player;

  beforeEach(function() {
    card = new SaturnSurfing();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Should play', function() {
    player.playedCards.push(new Sponsors());
    player.playedCards.push(new EarthOffice());
    card.play(player);
    expect(card.resourceCount).to.eq(3);
  });

  it('Can not act if no floaters on the card', function() {
    card.play(player);
    expect(card.resourceCount).to.eq(1);

    card.resourceCount = 0;
    expect(card.canAct()).is.not.true;
  });

  it('Can act', function() {
    player.playedCards.push(new Sponsors());
    player.playedCards.push(new EarthOffice());
    card.play(player);
    expect(card.resourceCount).to.eq(3);

    expect(card.canAct()).is.true;
    card.action(player);
    expect(card.resourceCount).to.eq(2);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(3);
  });

  it('Should give victory points', function() {
    card.play(player);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
