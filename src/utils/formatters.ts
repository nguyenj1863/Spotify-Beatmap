/**
 * Formats a Date object into a readable time string (e.g., 06:53:18 PM).
 * @param date The Date object to format.
 * @returns The formatted time string.
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};