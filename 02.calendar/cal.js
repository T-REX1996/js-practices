#!/usr/bin/env node

import minimist from "minimist";

const MIN_YEAR = 1970;
const MAX_YEAR = 2100;
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
// 「日 月 火 水 木 金 土 」の表示幅（全角=2桁）に、行末の余白2桁を足した幅
const CALENDAR_WIDTH = 22;

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
  // 「月」は全角なので表示幅は文字数より1大きい
  const displayWidth = title.length + 1;
  const padding = " ".repeat(Math.floor((CALENDAR_WIDTH - displayWidth) / 2));
  return `${padding}${title}`;
};

const buildCalendar = (year, month) => {
  // UTC で計算してタイムゾーンの影響を避ける
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const lastDay = new Date(Date.UTC(year, month, 0));

  const lines = [buildTitle(year, month), WEEKDAYS.join(" ")];

  let line = "   ".repeat(firstDay.getUTCDay());
  for (let day = 1; day <= lastDay.getUTCDate(); day++) {
    const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    line += String(day).padStart(2, " ");
    if (weekday === 6) {
      lines.push(line);
      line = "";
    } else {
      line += " ";
    }
  }
  if (line !== "") {
    lines.push(line.trimEnd());
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
