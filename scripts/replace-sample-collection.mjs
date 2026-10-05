import { googleApi } from './firebase-client.mjs';
import { initialProducts, defaultSettings } from '../src/catalog.js';
import { initialProducts as originalSamples } from '../tests/fixtures/catalog.js';
import { mkdir, writeFile } from 'node:fs/promises';

// Run after hosting the new images. Never overwrite an administrator's real stock.
const root = 'projects/muanoluxe/databases/(default)/documents';
const endpoint = `https://firestore.googleapis.com/v1/${root}`;
const encode = v => v === null ? {nullValue:null} : typeof v === 'boolean' ? {booleanValue:v} : typeof v === 'number' ? {integerValue:String(v)} : typeof v === 'string' ? {stringValue:v} : Array.isArray(v) ? {arrayValue:{values:v.map(encode)}} : {mapValue:{fields:Object.fromEntries(Object.entries(v).map(([k,x])=>[k,encode(x)]))}};
const get = async path => { try { return await googleApi(`${endpoint}/${path}`); } catch(e) { if(e.status===404)return null; throw e; } };
const writes=[], backup=[];
for (const id of ['signature-blazer','essential-shirt','sculpted-trouser','ribbed-knit']) {
  const doc=await get(`products/${id}`);
  if(!doc) continue;
  const original = originalSamples.find(p => p.id === id);
  const matchesOriginal = original && ['name','image','description','material'].every(k => doc.fields[k]?.stringValue === original[k]) && Number(doc.fields.price?.integerValue) === original.price;
  if(doc.fields.sample?.booleanValue!==true && !matchesOriginal) throw new Error(`Refusing to retire changed non-sample product ${id}.`);
  backup.push(doc);
  writes.push({update:{name:doc.name,fields:{active:{booleanValue:false}}},updateMask:{fieldPaths:['active']},currentDocument:{updateTime:doc.updateTime}});
}
const hosted = path => `https://muanoluxe.web.app${path}`;
for (const p of initialProducts) {
  if(await get(`products/${p.id}`)) throw new Error(`Product ${p.id} already exists; review it in Studio instead of overwriting.`);
  const image=hosted(p.image);
  const response=await fetch(image,{method:'HEAD'});
  if(!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Publish image first: ${image}`);
  writes.push({update:{name:`${root}/products/${p.id}`,fields:encode({...p,image,variants:p.variants.map(v=>({...v,image})),revision:1}).mapValue.fields},currentDocument:{exists:false}});
}
const settings=await get('settings/store');
if(!settings)throw new Error('Store settings missing.');
backup.push(settings);
const keys=['heroTitle','heroDescription','heroImage','storyTitle','storyText','storyTextSecondary','storyImage','announcement'];
const values=Object.fromEntries(keys.map(k=>[k,k.endsWith('Image')?hosted(defaultSettings[k]):defaultSettings[k]]));
values.published=false;
writes.push({update:{name:settings.name,fields:encode(values).mapValue.fields},updateMask:{fieldPaths:Object.keys(values)},currentDocument:{updateTime:settings.updateTime}});
await mkdir('artifacts',{recursive:true});
await writeFile('artifacts/collection-before-legacy.json',JSON.stringify(backup,null,2));
console.log(`Prepared ${writes.length} changes; backup saved. Checkout stays disabled.`);
if(process.argv.includes('--apply')) {
  await googleApi(`${endpoint}:commit`,'POST',{writes});
  console.log('Legacy sample collection published; previous sample products archived.');
} else console.log('Dry run only. Pass --apply to publish the prepared changes.');
