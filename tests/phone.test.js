import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhone } from '../src/phone.js';
test('normalizes local South African and international phone numbers',()=>{
  for(const value of ['082 123 4567','(082) 123-4567','821234567','27821234567','+27 82 123 4567','0027821234567']) assert.equal(normalizePhone(value),'+27821234567');
  assert.equal(normalizePhone('+44 7700 900123'),'+447700900123');
});
test('rejects malformed and incomplete numbers before sending an SMS',()=>{
  for(const value of ['', '08212','+270821234567','abc0821234567','0821234567 ext 1','++27821234567','12345678901234567']) assert.throws(()=>normalizePhone(value));
});
