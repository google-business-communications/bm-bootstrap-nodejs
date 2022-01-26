# BUSINESS MESSAGES BOOTSTRAP - NODE JS

This sample application demonstrates how to receive a message from the [Business Messages](https://developers.google.com/business-communications/business-messages/reference/rest) platform and replies to the user with
rich cards, links, suggestion chips and more features using the [Business Messages Node.js client library](https://github.com/google-business-communications/nodejs-businessmessages).

This sample has instructions to be deployed to Google App Engine or to run locally.

See the Google App Engine (https://cloud.google.com/appengine/docs/nodejs/)
standard environment documentation for more detailed instructions.

## Documentation

The documentation for the Business Messages API can be found [here](https://developers.google.com/business-communications/business-messages/reference/rest).

## Prerequisite

You must have the following software installed on your machine:

- [Node.js](https://nodejs.org/en/) - version 16 or above.
- [Google Cloud SDK](https://cloud.google.com/sdk/) (aka gcloud) - only needed if you are deploying to Google Cloud.

## Before you begin

1.  [Register with Business Messages](https://developers.google.com/business-communications/business-messages/guides/set-up/register).
1.  Once registered, follow the instructions to [enable the APIs for your project](https://developers.google.com/business-communications/business-messages/guides/how-to/register#enable-api).
1.  On the previous step, export the Service Accounkt Key JSON file to the root of
    this project an rename it to `service_account_key.json`. This key is used to
    authenticate the requests from this application to the Business Messages API.
1.  Open the [Create an agent](https://developers.google.com/business-communications/business-messages/guides/how-to/agents#create_an_agent)
    guide and follow the instructions to create a Business Messages agent.

## Running the project

Below there are instructions to run this project `Locally` and to deploy it to
`Google App Engine`. Just have in mind that to deploy to App Engine, you need to
have a billing account asociated to your Google Cloud Platform (GCP) project.

### Running this project locally

1.  In a terminal, navigate to this projects's root directory.

1.  Install the dependencies by running `npm install`.

1.  Make sure you followed the "Before you begin" section and there is a
    `service_account_key.json` in the root of this project.

1.  Start the service by running `npm run local`. By default, it starts in the
    port `3000`. If you like, configure the port in the `package.json`.

1.  Start accepting external internet traffic by running `npm run serve` in a new
    terminal window in the same project root folder. This command
    uses [Ngrok](https://ngrok.com/) to create a temporary https URL that resolves
    to this application.

1.  Copy the `https` URL displayed in the terminal to the Webhook field in your
    Partner Settings page in the Google [Business Communications Console](https://business-communications.cloud.google.com/console/partner/settings). Make sure to have the corect partner account selected in the
    dropdown menu at the top of the page.

1.  Go to the Agent's page in the [Business Communications console](https://business-communications.cloud.google.com/console/business-messages/overview) and click in "Send" Agent test URLs in the
    Agent Information section. Make sure to have the corect agent selected in the
    dropdown menu at the top of the page. See the [Test an agent](https://developers.google.com/business-communications/business-messages/guides/set-up/agent#test-agent) guide if you need help retrieving your test
    business URL.

1.  Open the email sent with the test URLs in your mobile device and start a
    conversation with the agent.

### Deploying this project to Google App Engine

Before you continue, create a `env_variables.yaml` file in the root of this project with the following content:

```
env_variables:
  PARTNER_KEY: ADD_YOUR_PARTNER_KEY_HERE

# Change `ADD_YOUR_PARTNER_KEY_HERE` to the partner key sent in the
# Business Messages partner registration email.
```

This file is imported by `app.yaml`, the configuration file for Google App Engine.
The partner key is used by this application to validate that all requests are
coming from the Business Messages API.

1.  In a terminal, navigate to this sample's root directory.

1.  Run the following commands:

    ```bash
    gcloud config set project PROJECT_ID
    ```

    Where PROJECT_ID is the project ID for the project you created when you
    registered for Business Messages. It can be found in the
    [Business Communications Console](https://business-communications.cloud.google.com/console/partner/settings).

    ```base
    gcloud app deploy
    ```

1.  Copy the `https` URL displayed in the terminal to the Webhook field in your
    Partner Settings page in the Google
    [Business Communications Console](https://business-communications.cloud.google.com/console/partner/settings).
    Make sure to have the corect partner account selected in the dropdown menu at the top of the page.

1.  Go to the [Overview page](https://business-communications.cloud.google.com/console/business-messages/overview)
    of the agent and click in "Send" Agent test URLs in the Agent Information section.
    Make sure to have the corect agent selected in the dropdown menu at the
    top of the page. See the [Test an agent](https://developers.google.com/business-communications/business-messages/guides/set-up/agent#test-agent) guide if you need help retrieving your test business URL.

1.  Open the email sent with the test URLs in your mobile device and start a
    conversation with the agent.

## Security

`NOTE:` It is recommended to validate the signature of incoming requests. To do that,
make sure `process.env.PARTNER_KEY` is available. Its value should be set to
the one sent in the partner registration email.

## Features

This sample application illustrates how to use the following features of the
Business Messages API:

- Messages:
  - Image
  - Plain text
  - Rich text
  - Rich card
  - Carousel
  - Suggestions (chips):
    - Text
    - Dial action
    - Open url action
    - Live agent request
- Events:
  - Typing started
  - Typing stopped
  - Representative joined
  - Representative left
- Representatives:
  - Bot
  - Human
