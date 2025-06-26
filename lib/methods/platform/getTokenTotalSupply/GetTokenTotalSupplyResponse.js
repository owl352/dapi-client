const AbstractResponse = require('../response/AbstractResponse');
const InvalidResponseError = require('../response/errors/InvalidResponseError');

class GetTokenTotalSupplyResponse extends AbstractResponse {
  /**
   * @param {bigint} totalCreditsInPlatform
   * @param {Metadata} metadata
   * @param {Proof} [proof]
   */
  constructor(tokenId, totalAggregatedAmountInUserAccounts, totalSystemAmount, metadata, proof = undefined) {
    super(metadata, proof);

    this.tokenId = tokenId;
    this.totalAggregatedAmountInUserAccounts = totalAggregatedAmountInUserAccounts;
    this.totalSystemAmount = totalSystemAmount;
  }

  /**
   * @returns {bigint}
   */
  getTotalCreditsInPlatform() {
    return this.totalCreditsInPlatform;
  }

  /**
   * @param proto
   * @returns {GetTokenTotalSupplyResponse}
   */
  static createFromProto(proto) {
    // eslint-disable-next-line
    const tokenId = proto.getV0().getTokenTotalSupply().getTokenId_asB64();
    const totalAggregatedAmountInUserAccounts = BigInt(proto.getV0().getTokenTotalSupply().getTotalAggregatedAmountInUserAccounts());
    const totalSystemAmount = BigInt(proto.getV0().getTokenTotalSupply().getTotalSystemAmount());


    const {metadata, proof} = AbstractResponse.createMetadataAndProofFromProto(
      proto,
    );

    if ((typeof tokenId === 'undefined' || tokenId === null) && !proof) {
      throw new InvalidResponseError('Token on Platform data is not defined');
    }

    return new GetTokenTotalSupplyResponse(
      tokenId,
      totalAggregatedAmountInUserAccounts,
      totalSystemAmount,
      metadata,
      proof,
    );
  }
}

module.exports = GetTokenTotalSupplyResponse;
