// Copyright 2022 Google LLC
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

import { google } from 'googleapis';

let _authClient;

/**
 * Initializes the Google credentials for calling the
 * Business Messages API.
 */
export async function initCredentials() {
  if (_authClient) {
    return _authClient;
  }

  // Configure a JWT auth client
  const authClient = new google.auth.JWT({
    keyFile: './bm-agent-service-account-credentials.json',
    scopes: ['https://www.googleapis.com/auth/businessmessages'],
  });

  return new Promise(function (resolve, reject) {
    // authenticate request
    authClient.authorize(function (err, credentials) {
      if (err) {
        reject(err);
      } else {
        _authClient = authClient;
        resolve(authClient);
      }
    });
  });
}
