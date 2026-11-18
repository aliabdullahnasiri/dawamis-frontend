import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Navbar from '../src/widgets/layout/NavBar';
import Configurator from '../src/widgets/layout/Configurator';
import { LocaleProvider } from '../src/i18n/locale';
import { MaterialControllerProvider } from '../src/context/MaterialProvider';
afterEach(() => { cleanup(); localStorage.clear(); });
function mount() {
 return render(<LocaleProvider><MaterialControllerProvider><MemoryRouter initialEntries={['/dashboard']}><Navbar/><Configurator/><Routes><Route path="/dashboard" element={<p>Workspace home</p>}/><Route path="/profile" element={<p>Profile destination</p>}/></Routes></MemoryRouter></MaterialControllerProvider></LocaleProvider>);
}
test('keyboard search filters real pages and navigates to the selected destination',async()=>{
 mount();fireEvent.keyDown(document,{key:'k',ctrlKey:true});
 const search=await screen.findByRole('combobox',{name:'Search pages and shortcuts'});
 fireEvent.change(search,{target:{value:'nothing-matches'}});expect(screen.getByText('No matching pages. Try a different name.')).toBeTruthy();
 fireEvent.change(search,{target:{value:'profile'}});fireEvent.keyDown(search,{key:'Enter'});
 expect(await screen.findByText('Profile destination')).toBeTruthy();
});
test('navbar toggles navigation and theme and opens the settings drawer',async()=>{
 mount();fireEvent.click(screen.getByRole('button',{name:'Close navigation'}));expect(screen.getByRole('button',{name:'Open navigation'})).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Use dark theme'}));expect(screen.getByRole('button',{name:'Use light theme'})).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'EMS Settings'}));expect(await screen.findByText('Appearance')).toBeTruthy();
});
test('language selection translates navbar without navigating away',async()=>{
 mount();fireEvent.click(screen.getByRole('button',{name:'Language'}));fireEvent.click(await screen.findByRole('menuitem',{name:'دری'}));
 expect(await screen.findByRole('button',{name:'جستجوی صفحه'})).toBeTruthy();expect(screen.getByText('Workspace home')).toBeTruthy();
});

test('Spotlight supports arrow-key selection, Enter, and Escape', async () => {
 mount();fireEvent.keyDown(document,{key:'k',metaKey:true});
 const search=await screen.findByRole('combobox',{name:'Search pages and shortcuts'});
 expect(screen.getByRole('option',{name:'Dashboard'}).getAttribute('aria-selected')).toBe('true');
 fireEvent.keyDown(search,{key:'ArrowDown'});
 expect(screen.getByRole('option',{name:'My Profile'}).getAttribute('aria-selected')).toBe('true');
 expect(search.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option',{name:'My Profile'}).id);
 fireEvent.keyDown(search,{key:'Enter'});expect(await screen.findByText('Profile destination')).toBeTruthy();
 fireEvent.keyDown(document,{key:'k',ctrlKey:true});const reopened=await screen.findByRole('combobox',{name:'Search pages and shortcuts'});
 expect((reopened as HTMLInputElement).value).toBe('');fireEvent.keyDown(reopened,{key:'Escape'});await waitFor(()=>expect(screen.queryByRole('combobox')).toBeNull());
});

test('Spotlight runs appearance, sidebar, and settings actions with the keyboard', async () => {
 mount();
 async function run(query: string) {
  fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
  const search = await screen.findByRole('combobox', { name: 'Search pages and shortcuts' });
  fireEvent.change(search, { target: { value: query } });
  fireEvent.keyDown(search, { key: 'Enter' });
  await waitFor(() => expect(screen.queryByRole('combobox')).toBeNull());
 }
 await run('dark mode');
 expect(screen.getByRole('button', { name: 'Use light theme' })).toBeTruthy();
 await run('white mode');
 expect(screen.getByRole('button', { name: 'Use dark theme' })).toBeTruthy();
 await run('toggle sidebar');
 expect(screen.getByRole('button', { name: 'Open navigation' })).toBeTruthy();
 await run('open settings');
 expect(await screen.findByText('Appearance')).toBeTruthy();
});

test('Spotlight changes language directly', async () => {
 mount();fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
 const search = await screen.findByRole('combobox', { name: 'Search pages and shortcuts' });
 fireEvent.change(search, { target: { value: 'Dari' } });
 fireEvent.keyDown(search, { key: 'Enter' });
 expect(await screen.findByRole('button', { name: 'جستجوی صفحه' })).toBeTruthy();
 expect(screen.getByText('Workspace home')).toBeTruthy();
});


test('Spotlight enters and exits fullscreen when supported', async () => {
 const enter = vi.fn().mockResolvedValue(undefined);
 const exit = vi.fn().mockResolvedValue(undefined);
 Object.defineProperty(document, 'fullscreenEnabled', { configurable: true, value: true });
 Object.defineProperty(document.documentElement, 'requestFullscreen', { configurable: true, value: enter });
 Object.defineProperty(document, 'exitFullscreen', { configurable: true, value: exit });
 try {
  mount();
  fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
  const search = await screen.findByRole('combobox', { name: 'Search pages and shortcuts' });
  fireEvent.change(search, { target: { value: 'fullscreen' } });
  fireEvent.keyDown(search, { key: 'Enter' });
  expect(enter).toHaveBeenCalledOnce();
  await waitFor(() => expect(screen.queryByRole('combobox')).toBeNull());
  Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: document.documentElement });
  fireEvent(document, new Event('fullscreenchange'));
  fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
  const reopened = await screen.findByRole('combobox', { name: 'Search pages and shortcuts' });
  fireEvent.change(reopened, { target: { value: 'fullscreen' } });
  expect(screen.getByRole('option', { name: 'Exit full screen' })).toBeTruthy();
  fireEvent.keyDown(reopened, { key: 'Enter' });
  expect(exit).toHaveBeenCalledOnce();
 } finally {
  Reflect.deleteProperty(document, 'fullscreenEnabled');
  Reflect.deleteProperty(document, 'fullscreenElement');
  Reflect.deleteProperty(document, 'exitFullscreen');
  Reflect.deleteProperty(document.documentElement, 'requestFullscreen');
 }
});
