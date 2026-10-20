/**
 * Custom image loader for Cloudflare Pages
 * Uses Cloudflare Images resizing via URL parameters
 * https://developers.cloudflare.com/images/transform-images/transform-via-url/
 */

export default function cloudflareImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // If src is already a full URL (external), return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // For local images, use Cloudflare's image resizing
  // The base URL will be the current origin
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const params = new URLSearchParams();
  params.set('w', width.toString());
  params.set('q', (quality || 75).toString());
  params.set('fit', 'scale-down');
  params.set('format', 'auto');

  return `${baseUrl}${src}?${params.toString()}`;
}