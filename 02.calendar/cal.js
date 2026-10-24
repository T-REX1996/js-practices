#!/usr/bin/env node

import minimist from "minimist";

const MIN_YEAR = 1970;
const MAX_YEAR = 2100;
const MIN_MONTH = 1;
const MAX_MONTH = 12;
const WEEKDAYS = "日 月 火 水 木 金 土";
// 「日 月 火 水 木 金 土」の表示幅（全角=2桁×7 + 空白×6）
const CALENDAR_WIDTH = 20;

const isValidYear = (year) =>
  Number.isInteger(year) && year >= MIN_YEAR && year <= MAX_YEAR;

const isValidMonth = (month) =>
  Number.isInteger(month) && month >= MIN_MONTH && month <= MAX_MONTH;

const buildTitle = (year, month) => {
  const title = `${month}月 ${year}`;
  const padding = " ".repeat(Math.floor((CALENDAR_WIDTH - title.length) / 2));
  return `${padding}${title}`;
};

const buildCalendar = (year, month) => {
  const lines = [buildTitle(year, month), WEEKDAYS];

  // UTC で計算してタイムゾーンの影響を避ける
  const firstDate = new Date(Date.UTC(year, month - 1, 1));
  const lastDate = new Date(Date.UTC(year, month, 0));

  let line = "   ".repeat(firstDate.getUTCDay());
  for (
    const date = new Date(firstDate);
    date <= lastDate;
    date.setUTCDate(date.getUTCDate() + 1)
  ) {
    line += String(date.getUTCDate()).padStart(2, " ");
    const isSaturday = date.getUTCDay() === 6;
    const isLastDayOfMonth = date.getTime() === lastDate.getTime();
    if (isSaturday || isLastDayOfMonth) {
      lines.push(line);
      line = "";
    } else {
      line += " ";
    }
  }

  return lines.join("\n");
};

const main = () => {
  const argv = minimist(process.argv.slice(2));
  const today = new Date();
  const year = argv.y ?? today.getFullYear();
  const month = argv.m ?? today.getMonth() + 1;

  if (!isValidYear(year)) {
    console.error(
      `-y は ${MIN_YEAR} から ${MAX_YEAR} の整数で指定してください`,
    );
    process.exitCode = 1;
    return;
  }
  if (!isValidMonth(month)) {
    console.error(
      `-m は ${MIN_MONTH} から ${MAX_MONTH} の整数で指定してください`,
    );
    process.exitCode = 1;
    return;
  }

  console.log(buildCalendar(year, month));
};

main();
