#!/usr/bin/env node

import minimist from "minimist";

const MIN_YEAR = 1970;
const MAX_YEAR = 2100;
const WEEKDAYS = "日 月 火 水 木 金 土";
// 「日 月 火 水 木 金 土」の表示幅（全角=2桁×7 + 空白×6）
const CALENDAR_WIDTH = 20;

const parseIntegerOption = (value, name, min, max, defaultValue) => {
  if (value === undefined) {
    return defaultValue;
  }
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} は ${min} から ${max} の整数で指定してください`);
  }
  return value;
};

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

  const year = parseIntegerOption(
    argv.y,
    "-y",
    MIN_YEAR,
    MAX_YEAR,
    today.getFullYear(),
  );
  const month = parseIntegerOption(argv.m, "-m", 1, 12, today.getMonth() + 1);

  console.log(buildCalendar(year, month));
};

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
