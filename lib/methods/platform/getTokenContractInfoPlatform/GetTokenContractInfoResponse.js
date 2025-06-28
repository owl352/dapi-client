const AbstractResponse = require('../response/AbstractResponse');
const InvalidResponseError = require('../response/errors/InvalidResponseError');

class GetTokenContractInfoResponse extends AbstractResponse {
  /**
   * @param {bigint} totalCreditsInPlatform
   * @param {Metadata} metadata
   * @param {Proof} [proof]
   */
  constructor(contractId, tokenContractPosition, metadata, proof = undefined) {
    super(metadata, proof);

    this.contractId = contractId;
    this.tokenContractPosition = tokenContractPosition;
  }

  /**
   * @returns {string}
   */
  getTokenContractId() {
    return this.contractId;
  }

  /**
   * @return {number}
   */
  getTokenContractPosition() {
    return this.tokenContractPosition;
  }

  /**
   * @param proto
   * @returns {GetTokenContractInfoResponse}
   */
  static createFromProto(proto) {
    // eslint-disable-next-line
    const data = proto.getV0().getData();

    const contractId = data.getContractId_asB64();
    const tokenContractPosition = data.getTokenContractPosition();

    const { metadata, proof } = AbstractResponse.createMetadataAndProofFromProto(
      proto,
    );

    if (((typeof contractId === 'undefined' || contractId === null) || (typeof tokenContractPosition === 'undefined' || tokenContractPosition === null)) && !proof) {
      throw new InvalidResponseError('Total Credits on Platform data is not defined');
    }

    return new GetTokenContractInfoResponse(
      contractId,
      tokenContractPosition,
      metadata,
      proof,
    );
  }
}

module.exports = GetTokenContractInfoResponse;
