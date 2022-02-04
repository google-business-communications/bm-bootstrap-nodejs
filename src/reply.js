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

import { debug } from './utils/debug.js';
import {
  CMD_IMAGE,
  CMD_RICH_TEXT,
  CMD_RICH_CARD,
  CMD_CAROUSEL,
  CMD_SURVEY,
  CMD_LIVE_AGENT,
} from './constants.js';
import { representativeJoined, representativeLeft } from './api/events.js';
import {
  sendTextOnlyMessage,
  sendRichTextMessage,
  sendImageMessage,
  sendRichCardMessage,
  sendCarouselMessage,
  sendLiveAgentMessage,
  sendHumanCatchingUpMessage,
} from './api/messages.js';
import { sendSurvey } from './api/survey.js';

/**
 * Choose how to respond to an incoming request body.
 * @param {Request} req HTTP Request
 * @return {Promise<void>}
 */
export async function reply(req) {
  const body = req.body;
  const conversationId = body.conversationId;

  debug('# Request Body:');
  debug(body);

  if (body.message || body.suggestionResponse) {
    let value;
    if (body.message) {
      debug('# Inbound: Message');
      value = body.message.text.trim().toLowerCase();
    } else {
      debug('# Inbound: Suggestion');
      value = body.suggestionResponse.postbackData.trim().toLowerCase();
    }
    debug('# Value: ' + value);

    switch (value) {
      case CMD_RICH_TEXT:
        debug('# Outbound: Rich text');
        await sendRichTextMessage(conversationId);
        break;
      case CMD_IMAGE:
        debug('# Outbound: Image');
        await sendImageMessage(conversationId);
        break;
      case CMD_RICH_CARD:
        debug('# Outbound: Rich card');
        await sendRichCardMessage(conversationId);
        break;
      case CMD_CAROUSEL:
        debug('# Outbound: Carousel');
        await sendCarouselMessage(conversationId);
        break;
      case CMD_LIVE_AGENT:
        debug('# Outbound: Live agent request');
        await sendLiveAgentMessage(conversationId);
        break;
      case CMD_SURVEY:
        debug('# Outbound: Survey');
        await sendSurvey(conversationId);
        break;
      default:
        debug('# Outbound: Plain text');
        const text = [
          `You said: ${value}`,
          `Try these keywords:`,
          `${CMD_RICH_TEXT}, ${CMD_IMAGE}, ${CMD_RICH_CARD}, ${CMD_CAROUSEL}`,
        ];
        await sendTextOnlyMessage(text.join('\n\n'), conversationId);
        break;
    }
  }

  if (body.receipts) {
    debug('# Inbound: Delivery receipt');
  }

  if (body.surveyResponse) {
    debug('# Inbound: Survey response');
  }

  if (body.authenticationResponse) {
    debug('# Inbound: Authentication response');
  }

  if (body.feedbackResponse) {
    debug('# Inbound: Feedback response');
  }

  if (body.userStatus) {
    debug('# Inbound: User status event');

    if (body.userStatus.isTyping === true) {
      debug('# Inbound: User is typing');
    }
    if (body.userStatus.isTyping === false) {
      debug('# Inbound: User finished typing');
    }

    if (body.userStatus.requestedLiveAgent) {
      debug('# Inbound: User requested a live agent');

      const sleep = async (ms) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      await representativeJoined(conversationId);
      await sleep(2000);
      await sendHumanCatchingUpMessage(conversationId);
      await sleep(2000);
      await representativeLeft(conversationId);
    }
  }
}
