const AbstractResponse = require('../response/AbstractResponse');
const InvalidResponseError = require('../response/errors/InvalidResponseError');

class GetIdentityTokenBalancesResponse extends AbstractResponse {
  /**
   * @param {array} tokenBalances
   * @param {Metadata} metadata
   * @param {Proof} [proof]
   */
  constructor(tokenBalances, metadata, proof = undefined) {
    super(metadata, proof);

    this.tokenBalances = tokenBalances;
  }

  /**
   * @returns {bigint}
   */
  getTotalCreditsInPlatform() {
    return this.totalCreditsInPlatform;
  }

  /**
   * @param proto
   * @returns {GetIdentityTokenBalancesResponse}
   */
  static createFromProto(proto) {
    // eslint-disable-next-line
    const tokenBalances = proto.getV0().getTokenBalances().getTokenBalancesList().map(balance => ({id: balance.getTokenId(), balance: balance.getBalance()}));

    const {metadata, proof} = AbstractResponse.createMetadataAndProofFromProto(
      proto,
    );

    return new GetIdentityTokenBalancesResponse(
      tokenBalances,
      metadata,
      proof,
    );
  }
}

module.exports = GetIdentityTokenBalancesResponse;
