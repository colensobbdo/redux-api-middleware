import { InternalError, ApiError } from './errors';

/**
 * Extract JSON body from a server response
 *
 * @function getJSON
 * @access public
 * @param {object} res - A raw response object
 * @returns {promise|undefined}
 */
async function getJSON(res) {
  if (res instanceof Error) {
    return res
  }
  
  const contentType = res.headers['content-type'];

  if (contentType && ~contentType.indexOf('json')) {
    return await res.json();
  } else {
    return await Promise.resolve();
  }
}

/**
 * Blow up string or symbol types into full-fledged type descriptors,
 *   and add defaults
 *
 * @function normalizeTypeDescriptors
 * @access private
 * @param {array} types - The [CALL_API].types from a validated RSAA
 * @returns {array}
 */
function getTypes(types) {
  let [request, success, failure] = types;

  if (typeof request === 'string' || typeof request === 'symbol') {
    request = { type: request };
  }

  if (typeof success === 'string' || typeof success === 'symbol') {
    success = { type: success };
  }
  success = {
    payload: (action, state, res) => getJSON(res),
    ...success
  };

  if (typeof failure === 'string' || typeof failure === 'symbol') {
    failure = { type: failure };
  }
  failure = {
    payload: (action, state, res) => getJSON(res),
    ...failure
  };

  return [request, success, failure];
}

/**
 * Evaluate a type descriptor to an FSA
 *
 * @function actionWith
 * @access private
 * @param {object} descriptor - A type descriptor
 * @param {array} args - The array of arguments for `payload` and `meta` function properties
 * @returns {object}
 */
async function actionWith(descriptor, args) {
  try {
    descriptor.payload = await (
      typeof descriptor.payload === 'function' ?
      descriptor.payload(...args) :
      descriptor.payload
    );
  } catch (e) {
    descriptor.payload = new InternalError(e.message);
    descriptor.error = true;
  }

  try {
    descriptor.meta = await (
      typeof descriptor.meta === 'function' ?
      descriptor.meta(...args) :
      descriptor.meta
    );
  } catch (e) {
    delete descriptor.meta;
    descriptor.payload = new InternalError(e.message);
    descriptor.error = true;
  }

  return descriptor;
}

export { getJSON, getTypes, actionWith };
