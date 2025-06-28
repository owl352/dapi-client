const {
  v0: {
    PlatformPromiseClient,
    GetTokenContractInfoRequest,
  },
} = require('@dashevo/dapi-grpc');

const GetTokenContractInfoResponse = require('./GetTokenContractInfoResponse');
const InvalidResponseError = require('../response/errors/InvalidResponseError');

/**
 * @param {GrpcTransport} grpcTransport
 * @returns {getTotalCreditsInPlatform}
 */
function getTokenContractInfoFactory(grpcTransport) {
  /**
   * Fetch the version upgrade votes status
   * @typedef {getTotalCreditsInPlatform}
   * @param {DAPIClientOptions & {prove: boolean}} [options]
   * @returns {Promise<GetTotalCreditsInPlatformResponse>}
   */
  async function getTotalCreditsInPlatform(tokenId ,options = {}) {
    const {
      GetTokenContractInfoRequestV0,
    } = GetTokenContractInfoRequest;

    if (Buffer.isBuffer(tokenId)) {
      // eslint-disable-next-line no-param-reassign
      tokenId = Buffer.from(tokenId);
    }

    // eslint-disable-next-line max-len
    const getTokenContractInfoRequest = new GetTokenContractInfoRequest();

    getTokenContractInfoRequest.setV0(
      new GetTokenContractInfoRequestV0()
        .setTokenId(tokenId)
        .setProve(!!options.prove),
    );

    let lastError;

    // TODO: simple retry before the dapi versioning is properly implemented
    for (let i = 0; i < 3; i += 1) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const getTokenContractInfoResponse = await grpcTransport.request(
          PlatformPromiseClient,
          'getTokenContractInfo',
          getTokenContractInfoRequest,
          options,
        );

        return GetTokenContractInfoResponse
          .createFromProto(getTokenContractInfoResponse);
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

  return getTotalCreditsInPlatform;
}

module.exports = getTokenContractInfoFactory;
