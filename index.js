// Import the Day.js library (if you're using Node.js)
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");

// Extend Day.js with the relativeTime plugin
dayjs.extend(relativeTime);

// Chuỗi thời gian ban đầu




  const output = dayjs("13:42 2023/11/01").fromNow();
  console.log(output)