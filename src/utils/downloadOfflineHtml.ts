import { generateSingleFileOfflineGame } from './offlineGameBuilder';

/**
 * Triggers instant in-browser Blob download of Richie-Diamond-Vault-OFFLINE.html
 * - 100% offline, pure JavaScript Blob, zero network latency, zero external servers
 * - Size < 100KB, perfect for sending to friends on WhatsApp or Email
 * - Double-click to run on any computer or phone without login
 */
export function downloadOfflineHtmlFile(): void {
  const htmlContent = generateSingleFileOfflineGame();
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = 'Richie-Diamond-Vault-OFFLINE.html';
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();

  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(blobUrl);
  }, 2000);
}
