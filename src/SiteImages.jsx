import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, live } from "./firebase";
import { siteMedia } from "../functions/site-media.js";

export default function SiteImages({ settings, onChange, onUploading, disabled }) {
  const [uploading, setUploading] = useState("");
  const [error, setError] = useState("");
  async function upload(key, file) {
    if (!file) return;
    setError("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size >= 5 * 1024 * 1024) {
      setError("Choose a JPEG, PNG, or WebP image smaller than 5 MB."); return;
    }
    if (!live) { setError("Uploads require the connected Studio. You can preview changes using image URLs here."); return; }
    setUploading(key); onUploading(true);
    try {
      const target = ref(storage, `products/site-${key}-${crypto.randomUUID()}`);
      await uploadBytes(target, file, { contentType: file.type });
      onChange(key, await getDownloadURL(target));
    } catch {
      setError("The image could not be uploaded. Check your connection and try again.");
    } finally { setUploading(""); onUploading(false); }
  }
  return <section className="site-images" aria-labelledby="site-images-title">
    <h3 id="site-images-title">Website images</h3>
    <p>Upload a photo or paste an HTTPS image URL. Save store settings to publish your changes. Product and colour photos are managed under Products.</p>
    <p>Use a tightly cropped logo and a square browser icon. Search engines and social networks may take time to refresh cached images.</p>
    {error && <p role="alert">{error}</p>}
    <div className="site-image-grid">{Object.entries(siteMedia).map(([key, item]) => <fieldset key={key} disabled={disabled || !!uploading}>
      <legend>{item.label}</legend>
      <img src={settings[key] || item.fallback} alt={`${item.label} preview`} loading="lazy" />
      <label>{item.label} image URL<input value={settings[key] || ""} required maxLength={2000} onChange={e => onChange(key, e.target.value)} /></label>
      <label className="site-image-upload">{uploading === key ? "Uploading…" : `Upload ${item.label.toLowerCase()}`}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { const file=e.target.files?.[0]; e.target.value=""; upload(key,file); }} /></label>
      <button type="button" className="button" onClick={() => onChange(key, item.fallback)}>Restore original</button>
    </fieldset>)}</div>
  </section>;
}
