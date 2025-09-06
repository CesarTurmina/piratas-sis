export function localNowISO(): string {
    const now = new Date();
    // Normaliza para ISO sem Z (interpretação local)
    const t = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return t.toISOString().slice(0, 19); // 'YYYY-MM-DDTHH:mm:ss'
  }