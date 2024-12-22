export function truncateMessage(message, maxLength) {
    if (message.length > maxLength)
      return message.substring(0, maxLength) + '...';
    return message;
}

export function checkStringEmpty(str) {
    return str === null || str === undefined || str === '' || !str.trim();
}