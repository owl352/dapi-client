const {
  v0: {
    PlatformPromiseClient,
    GetTokenTotalSupplyRequest,
  },
} = require('@dashevo/dapi-grpc');

const GetTokenTotalSupplyResponse = require('./GetTokenTotalSupplyResponse');
const InvalidResponseError = require('../response/errors/InvalidResponseError');

/**
 * @param {GrpcTransport} grpcTransport
 * @returns {getTokenTotalSupply}
 */
function getTokenTotalSupplyFactory(grpcTransport) {
  /**
   * Fetch the version upgrade votes status
   * @typedef {getTokenTotalSupply}
   * @param {DAPIClientOptions & {prove: boolean}} [options]
   * @returns {Promise<GetTotalCreditsInPlatformResponse>}
   */
  async function getTokenTotalSupply(tokenId, options = {}) {
    const {
      GetTokenTotalSupplyRequestV0,
    } = GetTokenTotalSupplyRequest;

    if (Buffer.isBuffer(tokenId)) {
      // eslint-disable-next-line no-param-reassign
      tokenId = Buffer.from(tokenId);
    }

    // eslint-disable-next-line max-len
    const getTokenTotalSupplyRequest = new GetTokenTotalSupplyRequest();

    getTokenTotalSupplyRequest.setV0(
      new GetTokenTotalSupplyRequestV0()
        .setTokenId(tokenId)
        .setProve(!!options.prove),
    );

    let lastError;

    // TODO: simple retry before the dapi versioning is properly implemented
    for (let i = 0; i < 3; i += 1) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const getTokenTotalSupplyResponse = await grpcTransport.request(
          PlatformPromiseClient,
          'getTokenTotalSupply',
          getTokenTotalSupplyRequest,
          options,
        );

        return GetTokenTotalSupplyResponse
          .createFromProto(getTokenTotalSupplyResponse);
      } catch (e) {
        if (e instanceof InvalidResponseError) {
          lastError = e;
        } else {
          throw e;
        }
      }
    }

    // If we made it past the cycle it means that the retry didn't work,
    // and we're throwing the last error encountered
    throw lastError;
  }

  return getTokenTotalSupply;
}

module.exports = getTokenTotalSupplyFactory;
