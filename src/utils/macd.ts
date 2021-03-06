import Trend from '@/utils/trend'

function calculateEma(data: Array<number>, length = 7): Array<number> {
  if (data.length == 0) {
    return [];
  }

  // based upon https://www.investopedia.com/ask/answers/122314/what-exponential-moving-average-ema-formula-and-how-ema-calculated.asp
  const k = 2 / (length + 1); // weight multiplier
  const emaArr = [0];
  for (let i = 1; i < data.length; i++) {
    if (i < length - 1) {
      emaArr.push(0);
    } else if ( i === length - 1 ) {
      emaArr.push(Math.round(
        data.slice(0, i + 1)
          .map((x) => x)
          .reduce((sum, current) => sum + current)
        / length));
    } else {
      const ema = data[i] * k + (emaArr[i-1] * (1 - k));
      emaArr.push(ema);
    }
  }
  return emaArr;
}

/**
 * Calculate MACD (emaShort - emaLong)
 */
function calculateMacd(emaShort: Array<number>, emaLong: Array<number>) {
  const macd = [];
  if (emaShort.length != emaLong.length) {
    throw "ema lengths don't match";
  }
  for (let i = 0; i < emaLong.length; i++) {
    macd.push(emaShort[i] - emaLong[i]);
  }
  return macd;
}

function calculateSignal(macd: Array<number>) {
  return calculateEma(macd, 9);
}

function calculateTrend(macd: any[], signal: Array<number>, range = 7): Trend {
  const lastWeekMacd = macd.slice(-range);
  const lastWeekSignal = signal.slice(-range);
  let trend = 0;

  // console.log(lastWeekMacd);
  // console.log(lastWeekSignal);

  let sumTrendAbs = 0;

  for (let i = 0; i < lastWeekMacd.length; i++) {
    const diff = lastWeekMacd[i] - lastWeekSignal[i];
    trend += diff;
    sumTrendAbs += Math.abs(diff);
  }

  const threshold = sumTrendAbs / 7;
  const thresholdDouble = sumTrendAbs / 7 * 5;

  if (trend < threshold && trend > -threshold) {
    return Trend.SIDE;
  } else if (trend > thresholdDouble) {
    return Trend.UP_UP;
  } else if (trend > threshold) {
    return Trend.UP;
  } else if (trend < -thresholdDouble) {
    return Trend.DOWN_DOWN;
  } else {
    return Trend.DOWN;
  }
}

export { calculateEma, calculateMacd, calculateSignal, calculateTrend };
