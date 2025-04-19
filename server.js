const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const SLACK_WEBHOOK_URL= process.env.SLACK_WEBHOOK_URL;
app.use(bodyParser.json());

app.post('/github-webhook', async (req, res) => {
    console.log('Made with ❤️ by Abhinav');
    console.log('Webhook received!');
  const event = req.headers['x-github-event'];

  if (event === 'push') {
    const { pusher, repository, commits } = req.body;

    const commitMessages = commits.map(commit => `- ${commit.message} (by ${commit.author.name})`).join('\n');

    const slackMessage = {
      text: `🚀 Hey there is a *new Push to \`${repository.name}\` by ${pusher.name}*\n${commitMessages}\n🔗 <${repository.html_url}|View Repo>`
    };

    try {
      await axios.post(SLACK_WEBHOOK_URL, slackMessage);
      console.log('✅ Slack message sent');
    } catch (error) {
      console.error('❌ Failed to send Slack message:', error.message);
    }
  }

  res.sendStatus(200); // Respond to GitHub
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});