import { test, expect } from '@playwright/test';
test('phone input accepts local numbers and studio exposes conversation history', async ({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:'Your account',exact:true}).click();
  const input=page.getByRole('textbox',{name:'Phone number',exact:true});
  await input.fill('082 123 4567');
  expect(await input.evaluate(el=>el.checkValidity())).toBe(true);
  await expect(page.getByText('South African numbers may start with 0.',{exact:false})).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Open shopping assistant'}).click();
  await expect(page.locator('.chat-disclosure')).toContainText('saved');
  await page.goto('/admin');
  await page.getByRole('button',{name:'Conversations',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Conversations',exact:true,level:2})).toBeVisible();
  await expect(page.getByText('Earlier chats were not saved.',{exact:false})).toBeVisible();
});
