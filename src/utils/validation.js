// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import crypto from 'crypto';

/**
 * Verify the message is from Google.
 * Learn more in the [documentation](https://developers.google.com/business-communications/business-messages/guides/build/receive#verify).
 *
 * @param {buffer} rawBody POST request payload.
 * @param {string} googleSignature Signature header.
 * @return {boolean}
 */
export function validateRequest(rawBody, googleSignature) {
  // WARNING: To increase the security level of your application,
  // use the PARTNER_KEY emailed to you during the partner registration
  // on the Business Messages website.
  if (!process.env.PARTNER_KEY) {
    return true;
  }

  // Calculate the signature to validate if the message is from Google
  const partnerKey = process.env.PARTNER_KEY;
  const generatedSignature = crypto
    .createHmac('sha512', partnerKey)
    .update(Buffer.from(rawBody, 'utf8'))
    .digest('base64');

  const isValidRequest = generatedSignature === googleSignature;
  if (!isValidRequest) {
    console.error('Signature mismatch. Do not trust this message.');
  }

  return isValidRequest;
}
