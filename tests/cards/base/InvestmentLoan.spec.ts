import {expect} from 'chai';
import {InvestmentLoan} from '../../../src/server/cards/base/InvestmentLoan';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('InvestmentLoan', function() {
  it('Should play', function() {
    const card = new InvestmentLoan();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(-1);
    expect(player.megaCredits).to.eq(10);
  });
});
