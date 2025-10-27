import { BskyAgent } from "@atproto/api";

export const getBlueskyAgent = async () => {
  const agent = new BskyAgent({
    service: process.env.BLUESKY_URL || "",
  });
  await agent.login({
    identifier: process.env.BLUESKY_USERNAME || "",
    password: process.env.BLUESKY_PASSWORD || "",
  });
  return agent;
};

export const postToBluesky = async (text: string) => {
  const agent = await getBlueskyAgent();
  try {
    await agent.post({
      text,
    });
  } catch (error) {
    console.error(error);
  } finally {
    await agent.logout();
  }
};
