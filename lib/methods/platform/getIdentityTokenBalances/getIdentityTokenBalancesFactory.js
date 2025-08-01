const {
  v0: {
    PlatformPromiseClient,
    GetIdentityTokenBalancesRequest,
  },
} = require('@dashevo/dapi-grpc');

const GetIdentityTokenBalancesResponse = require('./getIdentityTokenBalancesResponse');
const InvalidResponseError = require('../response/errors/InvalidResponseError');

/**
 * @param {GrpcTransport} grpcTransport
 * @returns {getIdentityTokenBalances}
 */
function getIdentityTokenBalancesFactory(grpcTransport) {
  /**
   * Fetch the version upgrade votes status
   * @typedef {getIdentityTokenBalances}
   * @param {DAPIClientOptions & {prove: boolean}} [options]
   * @returns {Promise<GetTotalCreditsInPlatformResponse>}
   */
  async function getIdentityTokenBalances(identityId, tokenIdList, options = {}) {
    const {
      GetIdentityTokenBalancesRequestV0,
    } = GetIdentityTokenBalancesRequest;

    if (Buffer.isBuffer(identityId)) {
      // eslint-disable-next-line no-param-reassign
      identityId = Buffer.from(identityId);
    }

    // eslint-disable-next-line max-len
    const getIdentityTokenBalancesRequest = new GetIdentityTokenBalancesRequest();

    getIdentityTokenBalancesRequest.setV0(
      new GetIdentityTokenBalancesRequestV0()
        .setIdentityId(identityId)
        .setTokenIdsList(tokenIdList)
        .setProve(!!options.prove),
    );

    let lastError;

    // TODO: simple retry before the dapi versioning is properly implemented
    for (let i = 0; i < 3; i += 1) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const getTokenTotalSupplyResponse = await grpcTransport.request(
          PlatformPromiseClient,
          'getIdentityTokenBalances',
          getIdentityTokenBalancesRequest,
          options,
        );

        return GetIdentityTokenBalancesResponse
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

  return getIdentityTokenBalances;
}

module.exports = getIdentityTokenBalancesFactory;
