export function normalizePhone(input) {
  let value = String(input || '').trim();
  if (!/^[+\d\s().-]+$/.test(value)) throw new Error('Enter a valid phone number.');
  value = value.replace(/[\s().-]/g, '');
  if (value.startsWith('00')) value = '+' + value.slice(2);
  if (/^0[1-9]\d{8}$/.test(value)) value = '+27' + value.slice(1);
  else if (/^27[1-9]\d{8}$/.test(value)) value = '+' + value;
  else if (/^[1-9]\d{8}$/.test(value)) value = '+27' + value;
  if (!/^\+[1-9]\d{7,14}$/.test(value) || (value.startsWith('+27') && !/^\+27[1-9]\d{8}$/.test(value))) {
    throw new Error('Enter a South African number such as 082 123 4567, or include + and your country code.');
  }
  return value;
}
