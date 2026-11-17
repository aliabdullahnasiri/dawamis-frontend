import { afterEach, expect, test } from 'vitest';
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
