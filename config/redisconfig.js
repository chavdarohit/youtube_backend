const Redis = require("ioredis");

const redisclient = new Redis(
  "rediss://default:433f4cbf1ae949b8a2b585566b23b36e@us1-careful-chipmunk-37630.upstash.io:37630"
);


const closeRedisConnection = () => {
  redisclient
    .quit()
    .then(() => {
      console.log("Redis connection closed successfully.");
    })
    .catch((err) => {
      console.error("Error closing Redis connection:", err);
    });
};
module.exports = { redisclient, closeRedisConnection };
