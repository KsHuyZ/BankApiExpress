// Import the Day.js library (if you're using Node.js)
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
const vi = require('dayjs/locale/vi'); 
// Extend Day.js with the relativeTime plugin
dayjs.extend(relativeTime);
dayjs.locale(vi);
// Chuỗi thời gian ban đầu




  const output = dayjs();
  console.log(output)