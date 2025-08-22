function createTrayIcon() {
  // Simple white square 16x16 icon in base64
  const iconBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlQTFRF////AAAA////QbMjZQAAAAN0Uk5TAP//RFDWIQAAAAlwSFlzAAAASAAAAEgARslrPgAAAA5JREFUGNNjYBgFo2AUAAACcAABNvhxpwAAAABJRU5ErkJggg==';
  
  let icon;
  try {
    icon = nativeImage.createFromDataURL(iconBase64);
  } catch (e) {
    console.log('Creating empty icon due to error:', e);
    icon = nativeImage.createEmpty();
  }
  
  return icon;
}

module.exports = { createTrayIcon };
