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

/**
 * Send surveys to track user satisfaction
 * URL: https://developers.google.com/business-communications/business-messages/guides/how-to/message/surveys
 */

import businessmessages from 'businessmessages';
import { v4 as uuidv4 } from 'uuid';
import { initCredentials } from './auth.js';
import { debug } from '../utils/debug.js';

// Initialize the Business Messages API
const bmApi = new businessmessages.businessmessages_v1.Businessmessages({});

/**
 * Creates a new survey to send to a user.
 *
 * @param {string} conversationId The unique id for this user and agent.
 */
export async function sendSurvey(conversationId) {
  const auth = await initCredentials();

  const options = {
    auth: auth,
    parent: 'conversations/' + conversationId,
    surveyId: uuidv4(),
    resource: {},
  };

  return new Promise((resolve, reject) => {
    bmApi.conversations.surveys.create(options, (err, response) => {
      if (err) {
        debug(err.response);
      }
      return err ? reject(err) : resolve(response);
    });
  });
}
