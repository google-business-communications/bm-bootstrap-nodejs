# BUSINESS MESSAGES BOOTSTRAP - NODE JS

This sample application demonstrates how to receive messages from the [Business Messages](https://developers.google.com/business-communications/business-messages/reference/rest) platform and how to reply to users with
rich cards, links, suggestion chips and more with the [Business Messages Node.js client library](https://github.com/google-business-communications/nodejs-businessmessages).

This sample includes instructions for running locally and for deploying to Google App Engine.

See the [Google App Engine standard environment documentation] (https://cloud.google.com/appengine/docs/nodejs/) for more detailed instructions.

## Documentation

You can find reference documentation for the Business Messages API on the [Business Messages developer site](https://developers.google.com/business-communications/business-messages/reference/rest).

## Prerequisite

You must have the following software installed on your machine:

- [Node.js](https://nodejs.org/en/) version 16 or above.
- [Google Cloud SDK](https://cloud.google.com/sdk/) (aka gcloud). Only needed if you deploy to Google Cloud.

## Before you begin

1.  [Register with Business Messages](https://developers.google.com/business-communications/business-messages/guides/set-up/register).

1.  Once registered, follow the instructions to [enable the APIs for your Business Messages account](https://developers.google.com/business-communications/business-messages/guides/how-to/register#enable-api) and download your service account key.

1.  Move your service account key file to the root of this sample an rename it
    to `bm-agent-service-account-credentials.json`. This key is used to
    authenticate the requests from this sample to the Business Messages API.

1.  Open the [Create an agent](https://developers.google.com/business-communications/business-messages/guides/how-to/agents#create_an_agent)
    guide and follow the instructions to create a Business Messages agent.

## Run the sample

You can run this sample locally or deploy it to Google App Engine. If you
deploy to App Engine, you need to have a billing account associated with your
Google Cloud Platform (GCP) project.

### Run locally

1.  In a terminal, navigate to this sample's root directory.

1.  Install the dependencies:

    ```bash
    npm install
    ```

1.  Confirm that `bm-agent-service-account-credentials.json` is in the root
    directory. If it isn't, see "Before you begin".

1.  Start the service:

    ```bash
    npm run local
    ```

    By default, the service runs on port `3000`. You can change the port in `package.json`.

1.  In a new terminal window, navigate to the sample's root directory, then start
    accepting external internet traffic:

    ```bash
    npm run serve
    ```

    This command uses [Ngrok](https://ngrok.com/) to create a temporary HTTPS URL
    that resolves to this sample.

1.  Copy the `https://` URL displayed in the terminal.

1.  Navigate to [Partner Settings](https://business-communications.cloud.google.com/console/partner/settings) in the Business Communications Developer Console and select the correct
    partner account from the dropdown menu at the top of the page.

1.  For **Business Messages webhook URL**, enter the `https://` URL.

1.  Click **Save**.

1.  Navigate to Developer Console [Home page](https://business-communications.cloud.google.com/console/), and choose your agent.

1.  Under **Agent information**, click **Send**, confirm the email address, then
    click **Send email** to send your test URLs to yourself in an email. If you
    need help retrieving your test URLs, see [Test an agent](https://developers.google.com/business-communications/business-messages/guides/how-to/agents#test-agent).

1.  On your mobile device, open the email and open a test URL to start a conversation with your agent.

### Deploy to Google App Engine

Before you continue, add `env_variables.yaml` to the `.gitignore` file.

1.  In a terminal, navigate to this sample's root directory.

1.  Set the Google Cloud project:

    ```bash
    gcloud config set project PROJECT_ID
    ```

    `PROJECT_ID` is the **GCP project** value associated with your partner account. You can find it in [Partner Settings](https://business-communications.cloud.google.com/console/partner/settings).

1.  Deploy the sample Google App Engine:

    ```bash
    gcloud app deploy
    ```

1.  Copy the `https://` URL displayed in the terminal.

1.  Navigate to [Partner Settings](https://business-communications.cloud.google.com/console/partner/settings) in the Business Communications Developer Console and select the correct
    partner account from the dropdown menu at the top of the page.

1.  For **Business Messages webhook URL**, enter the `https://` URL.

1.  Click **Save**.

1.  Navigate to Developer Console [Home page](https://business-communications.cloud.google.com/console/), and choose your agent.

1.  Under **Agent information**, click **Send**, confirm the email address, then
    click **Send email** to send your test URLs to yourself in an email. If you
    need help retrieving your test URLs, see [Test an agent](https://developers.google.com/business-communications/business-messages/guides/how-to/agents#test-agent).

1.  On your mobile device, open the email and open a test URL to start a conversation
    with your agent.

## Configure agent-level webhook

This sample supports agent-level webhooks, but make sure to validate incoming
webhook change requests by configuring the `CLIENT_TOKEN` environment variable.

To set the client token in your local development environment,

1. Set the `process.env.CLIENT_TOKEN` variable:

   ```bash
   CLIENT_TOKEN=ADD_YOUR_CLIENT_TOKEN_HERE
   ```

1. Restart the service.

To set your client token in Google App Engine,

1.  Open `env_variables.yaml`.
1.  Update the `CLIENT_TOKEN` variable with your client token.
1.  Save `env_variables.yml`.
1.  Re-deploy to Google App Engine.

## Security

Use your partner key to validate that all requests are coming from the Business Messages API.

To set your partner key in your local development environment,

1.  Set the `process.env.PARTNER_KEY` variable:

    ```bash
    PARTNER_KEY=ADD_YOUR_PARTNER_KEY_HERE
    ```

1.  Restart the service.

To set your partner key in Google App Engine,

1.  Open `env_variables.yaml`.
1.  Update the `PARTNER_KEY` variable with your partner key.
1.  Save `env_variables.yml`.
1.  Re-deploy to Google App Engine.

## Features

This sample illustrates how to use the following features of the
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
