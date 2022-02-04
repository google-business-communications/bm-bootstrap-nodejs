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
 * Send and receive events to enrich conversations
 * URL: https://developers.google.com/business-communications/business-messages/guides/how-to/message/events
 */

import businessmessages from 'businessmessages';
import { v4 as uuidv4 } from 'uuid';
import { initCredentials } from './auth.js';
import { HUMAN_REPRESENTATIVE } from './representative.js';
import { debug } from '../utils/debug.js';

// Initialize the Business Messages API
const bmApi = new businessmessages.businessmessages_v1.Businessmessages({});

/**
 * Sends an event that indicates the bot started typing.
 * @param {string} conversationId The unique id for this user and agent.
 * @param {object} representative Representative object
 *  BOT_REPRESENTATIVE | HUMAN_REPRESENTATIVE
 * @return {Promise}
 */
export async function startTyping(conversationId, representative) {
  return sendEvent(conversationId, 'TYPING_STARTED', representative);
}

/**
 * Sends an event that indicates the bot stopped typing.
 * @param {string} conversationId The unique id for this user and agent.
 * @param {object} representative Representative object
 *  BOT_REPRESENTATIVE | HUMAN_REPRESENTATIVE
 * @return {Promise}
 */
export async function stopTyping(conversationId, representative) {
  return sendEvent(conversationId, 'TYPING_STOPPED', representative);
}

/**
 * Sends an event that indicates the human representative joined.
 * @param {string} conversationId The unique id for this user and agent.
 * @return {Promise}
 */
export async function representativeJoined(conversationId) {
  return sendEvent(
    conversationId,
    'REPRESENTATIVE_JOINED',
    HUMAN_REPRESENTATIVE
  );
}

/**
 * Sends an event that indicates the human representative left.
 * @param {string} conversationId The unique id for this user and agent.
 * @return {Promise}
 */
export async function representativeLeft(conversationId) {
  return sendEvent(conversationId, 'REPRESENTATIVE_LEFT', HUMAN_REPRESENTATIVE);
}

/**
 * Sends an event that indicates the agent started or stopped typing.
 * @param {string} conversationId The unique id for this user and agent.
 * @param {string} eventType
 *  TYPING_STARTED | TYPING_STOPPED |
 *  REPRESENTATIVE_JOINED | REPRESENTATIVE_LEFT
 * @param {object} representative Representative object.
 * @return {Promise}
 */
async function sendEvent(conversationId, eventType, representative) {
  const auth = await initCredentials();

  const options = {
    auth: auth,
    parent: 'conversations/' + conversationId,
    eventId: uuidv4(),
    resource: {
      eventType: eventType,
      representative: representative,
    },
  };

  return new Promise((resolve, reject) => {
    bmApi.conversations.events.create(options, (err, response) => {
      if (err) {
        debug(err.response);
      }
      return err ? reject(err) : resolve(response);
    });
  });
}
