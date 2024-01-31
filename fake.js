const faker = require('faker');
const fs = require("fs");

const generateData = () => {
  const data = [];

  for (let i = 1; i <= 2000; i++) {
    const channel = {
      channelName: faker.internet.userName(),
      description: faker.lorem.sentence(),
      subscribersCount: faker.random.number({ min: 1000, max: 100000 }),
      avatarImage: faker.image.imageUrl(),
      isPremium: faker.random.boolean(),
    };

    data.push(channel);
  }

  return data;
};

const jsonData = generateData();
fs.writeFileSync("channels_data.json", JSON.stringify(jsonData, null, 2));

console.log("Data generated and saved to channels_data.json");
