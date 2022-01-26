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

/**
 * Send messages
 * URL: https://developers.google.com/business-communications/business-messages/guides/how-to/message/send
 */

import businessmessages from 'businessmessages';
import { v4 as uuidv4 } from 'uuid';
import { SAMPLE_IMAGES, POSTBACK } from '../constants.js';
import { initCredentials } from './auth.js';
import { BOT_REPRESENTATIVE, HUMAN_REPRESENTATIVE } from './representative.js';
import { debug } from '../utils/debug.js';
import { startTyping, stopTyping } from './events.js';

// Initialize the Business Messages API
const bmApi = new businessmessages.businessmessages_v1.Businessmessages({});

/**
 * Sends the message received from the user back to the user.
 * Docs: https://developers.google.com/business-communications/business-messages/guides/how-to/message/send#text
 *
 * @param {string} message The message text received from the user.
 * @param {string} conversationId The unique id for this user and agent.
 */
export async function sendTextOnlyMessage(message, conversationId) {
  await sendResponse(
    {
      messageId: uuidv4(),
      representative: BOT_REPRESENTATIVE,
      text: message,
      suggestions: listSuggestions(),
    },
    conversationId
  );
}

/**
 * Sends a message with markdown formatting.
 * Docs: https://developers.google.com/business-communications/business-messages/guides/how-to/message/send#rich_text
 *
 * @param {string} conversationId The unique id for this user and agent.
 */
export async function sendRichTextMessage(conversationId) {
  await sendResponse(
    {
      messageId: uuidv4(),
      representative: BOT_REPRESENTATIVE,
      containsRichText: true, // Force this to be processed as rich text
      text:
        'Hello, here is some **bold text**, *italicized text*, and a ' +
        '[link](https://www.google.com).',
      fallback:
        'Hello, here is some bold text, italicized text, and a link https://www.google.com.',
      suggestions: listSuggestions(),
    },
    conversationId
  );
}

/**
 * Sends an image.
 * Docs: https://developers.google.com/business-communications/business-messages/guides/how-to/message/send#images
 *
 * @param {string} conversationId The unique id for this user and agent.
 */
export async function sendImageMessage(conversationId) {
  await sendResponse(
    {
      messageId: uuidv4(),
      representative: BOT_REPRESENTATIVE,
      image: {
        contentInfo: {
          altText: 'Alternative text',
          fileUrl: SAMPLE_IMAGES[0],
          forceRefresh: true,
        },
      },
      fallback:
        'Hello, world!\n' + 'An image has been sent with Business Messages.',
      suggestions: listSuggestions(),
    },
    conversationId
  );
}

/**
 * Sends a sample rich card to the user.
 * Docs: https://developers.google.com/business-communications/business-messages/guides/how-to/message/send#rich-cards
 *
 * @param {string} conversationId The unique id for this user and agent.
 */
export async function sendRichCardMessage(conversationId) {
  const title = 'This is a Title';
  const description = 'This is a description for the rich card';
  const fileUrl = SAMPLE_IMAGES[0];
  const suggestions = listSuggestions(false);

  await sendResponse(
    {
      messageId: uuidv4(),
      representative: BOT_REPRESENTATIVE,
      richCard: {
        standaloneCard: {
          cardContent: {
            title: title,
            description: description,
            media: {
              height: 'MEDIUM',
              contentInfo: {
                fileUrl: fileUrl,
                forceRefresh: false,
              },
            },
            suggestions: suggestions.slice(0, 4), // Maximum allowed: 4
          },
        },
      },
      fallback: title + '\n\n' + description + '\n\n' + fileUrl,
    },
    conversationId
  );
}

/**
 * Sends a sample carousel rich card to the user.
 *
 * @param {string} conversationId The unique id for this user and agent.
 */
export async function sendCarouselMessage(conversationId) {
  const carouselCard = getSampleCarousel();

  // Construct a fallback text for devices that do not support carousels.
  const fallback = carouselCard.cardContents
    .reduce((acc, cardContent) => {
      acc.push(cardContent.title);
      acc.push(cardContent.description);
      acc.push(cardContent.media.contentInfo.fileUrl);
      acc.push('-------------------------------');
      return acc;
    }, [])
    .join('\n\n');

  await sendResponse(
    {
      messageId: uuidv4(),
      representative: BOT_REPRESENTATIVE,
      richCard: {
        carouselCard: carouselCard,
      },
      fallback: fallback,
    },
    conversationId
  );
}

/**
 * Creates a sample carousel rich card.
 *
 * @return {object} A carousel rich card.
 */
function getSampleCarousel() {
  const cardContents = [];
  const suggestions = listSuggestions(false);

  // Create individual cards for the carousel
  for (let i = 0; i < SAMPLE_IMAGES.length; i++) {
    cardContents.push({
      title: 'Card #' + (i + 1),
      description: 'This is a sample card',
      suggestions: suggestions.slice(0, 2), // Only show the first 2.
      media: {
        height: 'MEDIUM',
        contentInfo: {
          altText: 'Alt text for image ' + i,
          fileUrl: SAMPLE_IMAGES[i],
          forceRefresh: false,
        },
      },
    });
  }

  return {
    cardWidth: 'MEDIUM',
    cardContents: cardContents,
  };
}

/**
 * Sends a message with a liveAgentRequest sugestion.
 *
 * @param {string} conversationId The unique id for this user and agent.
 */
export async function sendLiveAgentMessage(conversationId) {
  await sendResponse(
    {
      messageId: uuidv4(),
      representative: BOT_REPRESENTATIVE,
      text: 'Would you like to chat with a live agent?',
      fallback: 'Would you like to chat with a live agent?',
      suggestions: listSuggestions(),
    },
    conversationId
  );
}

/**
 * Sends the message to the user as a human representative.
 *
 * @param {string} conversationId The unique id for this user and agent.
 */
export async function sendHumanCatchingUpMessage(conversationId) {
  const message =
    `Hi, I'm a human representative. \n\n` +
    `Give me a moment to catch up on your chat messages.`;

  await sendResponse(
    {
      messageId: uuidv4(),
      representative: HUMAN_REPRESENTATIVE,
      text: message,
    },
    conversationId
  );
}

/**
 * Sample suggestions.
 * Docs: https://developers.google.com/business-communications/business-messages/guides/how-to/message/send#suggested_replies
 *
 * @param {boolean} includeLiveAgentRequest
 * @return {Array} A list of suggestion objects.
 */
function listSuggestions(includeLiveAgentRequest = true) {
  const IMAGE_SUGGESTION = {
    reply: {
      text: 'Image',
      postbackData: POSTBACK.image,
    },
  };

  const RICH_TEXT_SUGGESTION = {
    reply: {
      text: 'Rich text',
      postbackData: POSTBACK.richText,
    },
  };

  const RICH_CARD_SUGGESTION = {
    reply: {
      text: 'Rich card',
      postbackData: POSTBACK.richCard,
    },
  };

  const CAROUSEL_SUGGESTION = {
    reply: {
      text: 'Carousel',
      postbackData: POSTBACK.carousel,
    },
  };

  const CALL_SUGGESTION = {
    action: {
      text: 'Call',
      postbackData: POSTBACK.call,
      dialAction: {
        phoneNumber: '+12223334444',
      },
    },
  };

  const WEBSITE_SUGGESTION = {
    action: {
      text: 'Website',
      postbackData: POSTBACK.url,
      openUrlAction: {
        url: 'https://www.google.com',
      },
    },
  };

  const OPEN_YOUTUBE_APP_SUGGESTION = {
    action: {
      text: 'YouTube Video',
      postbackData: POSTBACK.appYoutube,
      openUrlAction: {
        url: 'https://www.youtube.com/embed/C_aBjZ9RfVE',
      },
    },
  };

  const LIVE_AGENT_REQUEST_SUGGESTION = {
    liveAgentRequest: {},
  };

  const suggestions = [
    IMAGE_SUGGESTION,
    RICH_TEXT_SUGGESTION,
    RICH_CARD_SUGGESTION,
    CAROUSEL_SUGGESTION,
    CALL_SUGGESTION,
    WEBSITE_SUGGESTION,
    OPEN_YOUTUBE_APP_SUGGESTION,
  ];

  // Live agent request is not supported in Rich cards.
  if (includeLiveAgentRequest) {
    suggestions.push(LIVE_AGENT_REQUEST_SUGGESTION);
  }

  return suggestions;
}

/**
 * Posts a message to the Business Messages API, first sending a typing
 * indicator event and sending a stop typing event after the message
 * has been sent.
 *
 * @param {object} messageObject The message object payload to send to the user.
 * @param {string} conversationId The unique id for this user and agent.
 */
async function sendResponse(messageObject, conversationId) {
  await startTyping(conversationId, messageObject.representative);
  await sendMessage(conversationId, messageObject);
  await stopTyping(conversationId, messageObject.representative);
}

/**
 * Sends a message to the messages API.
 * @param {string} conversationId The unique id for this user and agent.
 * @param {object} messageObject Message resource.
 * @return {function} Function to send the message to the API.
 */
async function sendMessage(conversationId, messageObject) {
  const auth = await initCredentials();

  const options = {
    auth: auth,
    parent: 'conversations/' + conversationId,
    resource: messageObject,
    forceFallback: false,
  };

  return new Promise((resolve, reject) => {
    // Call the message create function using the
    // Business Messages client library
    bmApi.conversations.messages.create(options, (err, response) => {
      if (err) {
        debug(err.response);
      }
      return err ? reject(err) : resolve(response);
    });
  });
}
