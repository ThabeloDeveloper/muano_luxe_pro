import { mediaDefaults } from "../functions/site-media.js";
export default function BrandMark({ src = mediaDefaults.logoImage }) {
  return <span className={`brand-emblem${src === mediaDefaults.logoImage ? "" : " custom-logo"}`} aria-hidden="true">
    <img src={src} alt="" width="1254" height="1254" />
  </span>;
}
