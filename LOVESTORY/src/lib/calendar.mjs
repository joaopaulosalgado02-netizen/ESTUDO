export function saoPauloDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  return ['year', 'month', 'day'].map(key => parts.find(part => part.type === key).value).join('-');
}

/** Calendar arithmetic with a clamped monthly anniversary; never parses dates as UTC. */
export function calendarElapsed(start, today = saoPauloDate()) {
  const valid = value => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T12:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0,10) === value;
  };
  if (!valid(start) || !valid(today) || start > today) return { years: 0, months: 0, days: 0 };
  const [sy, sm, sd] = start.split('-').map(Number);
  const [ty, tm, td] = today.split('-').map(Number);
  const atMonth = count => {
    const date = new Date(Date.UTC(sy, sm - 1 + count, 1));
    const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    date.setUTCDate(Math.min(sd, last));
    return date;
  };
  let months = (ty - sy) * 12 + tm - sm;
  const target = new Date(Date.UTC(ty, tm - 1, td));
  if (atMonth(months) > target) months--;
  return { years: Math.floor(months / 12), months: months % 12, days: Math.round((target - atMonth(months)) / 86400000) };
}
