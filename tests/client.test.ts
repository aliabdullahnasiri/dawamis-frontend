import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { financialIntent, request, setTokens } from '../src/api/client.ts';
const original = globalThis.fetch;
afterEach(() => { globalThis.fetch = original; setTokens(); });
test('uncertain retries and double clicks preserve payload and key', async () => {
 const calls: RequestInit[] = [];
 globalThis.fetch = async (_url, options) => { calls.push(options!); if (calls.length === 1) throw new TypeError('offline'); return new Response('{"success":true,"data":{"id":1}}'); };
 const intent = financialIntent('/exchanges', { amount: '100000000000000.001' });
 await assert.rejects(intent.submit());
 const [a,b] = await Promise.all([intent.submit(),intent.submit()]);
 assert.deepEqual(a,b); assert.equal(calls.length,2);
 assert.equal(calls[0].body,calls[1].body);
 assert.equal(new Headers(calls[0].headers).get('Idempotency-Key'),new Headers(calls[1].headers).get('Idempotency-Key'));
 await intent.submit(); assert.equal(calls.length,2);
});
test('simultaneous expired requests share refresh', async () => {
 setTokens({access:'old',refresh:'refresh'}); let refreshes = 0;
 globalThis.fetch = async (url, options) => {
  if (String(url).endsWith('/auth/refresh')) { refreshes++; await new Promise(r=>setTimeout(r,5)); return Response.json({data:{access_token:'new'}}); }
  return new Headers(options?.headers).get('Authorization') === 'Bearer old' ? new Response('',{status:401}) : Response.json({success:true,data:'ok'});
 };
 assert.deepEqual(await Promise.all([request('/one'),request('/two')]),['ok','ok']); assert.equal(refreshes,1);
});
test('failed refresh invalidates pending financial intents', async () => {
 setTokens({access:'old',refresh:'refresh'}); const intent=financialIntent('/exchange',{amount:'1.00'});
 globalThis.fetch=async()=>new Response('',{status:401});
 await assert.rejects(request('/context'),{status:401}); await assert.rejects(intent.submit(),{status:409});
});
test('validation paths preserve array indexes and reject prototype paths', async () => {
 globalThis.fetch=async()=>Response.json({errors:[{loc:['body','items',0,'amount'],msg:'Invalid amount'},{loc:['body','__proto__'],msg:'bad'}]},{status:422});
 await assert.rejects(request('/test'),(error: unknown)=> { const e=error as {fields:Record<string,string>}; assert.equal(e.fields['items.0.amount'],'Invalid amount'); assert.equal(Object.keys(e.fields).length,1); return true; });
});
test('binary responses remain binary',async()=>{globalThis.fetch=async()=>new Response('a,b\n1,2');assert.equal(await (await request<Blob>('/export',{},true)).text(),'a,b\n1,2');});
