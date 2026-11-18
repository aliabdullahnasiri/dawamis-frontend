import { useEffect } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { Link, MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { LocaleProvider, useLocale } from '../src/i18n/locale';
import { RouteSkeleton } from '../src/components/shared/PageSkeleton';
import { PageLoading, PAGE_LOADING_DELAY } from '../src/components/shared/PageLoading';

afterEach(() => { cleanup(); vi.useRealTimers(); localStorage.clear(); });
function Controls() {
 const navigate = useNavigate();
 const { pathname } = useLocation();
 const { setLocale } = useLocale();
 return <><span>{pathname}</span><button onClick={() => navigate('/account/security')}>Security</button><button onClick={() => setLocale('fa')}>Dari</button></>;
}
function Content({ start }: { start: () => void }) {
 useEffect(() => { start(); }, [start]);
 return <input aria-label="Page input" defaultValue="Preserve this"/>;
}
function mount(start = vi.fn()) {
 return render(<LocaleProvider><MemoryRouter initialEntries={['/profile']}><Controls/><PageLoading><Content start={start}/></PageLoading></MemoryRouter></LocaleProvider>);
}
test('spinner delays presentation while the page mounts and starts its work immediately', () => {
 vi.useFakeTimers();const start=vi.fn();mount(start);
 expect(start).toHaveBeenCalledTimes(1);expect(screen.getByRole('status')).toBeTruthy();expect(screen.queryByRole('textbox')).toBeNull();
 act(() => vi.advanceTimersByTime(PAGE_LOADING_DELAY-1));expect(screen.queryByRole('textbox')).toBeNull();
 act(() => vi.advanceTimersByTime(1));expect(screen.queryByRole('status')).toBeNull();expect(screen.getByRole('textbox',{name:'Page input'})).toBeTruthy();
});
test('changing language preserves input state without replaying the spinner', () => {
 vi.useFakeTimers();mount();act(() => vi.advanceTimersByTime(PAGE_LOADING_DELAY));
 fireEvent.change(screen.getByRole('textbox'),{target:{value:'Edited value'}});fireEvent.click(screen.getByRole('button',{name:'Dari'}));
 expect(screen.queryByRole('status')).toBeNull();expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Edited value');
});
test('navigation after startup shows the destination immediately', () => {
 vi.useFakeTimers();
 mount();
 act(() => vi.advanceTimersByTime(PAGE_LOADING_DELAY));
 fireEvent.click(screen.getByRole('button', { name: 'Security' }));
 expect(screen.getByText('/account/security')).toBeTruthy();
 expect(screen.queryByRole('status')).toBeNull();
 expect(screen.getByRole('textbox')).toBeTruthy();
});

test('clicking a page link restarts the skeleton even for the current page', () => {
 vi.useFakeTimers();
 render(<LocaleProvider><MemoryRouter initialEntries={['/profile']}>
  <Link to="/account/security">Security</Link>
  <RouteSkeleton kind="security"><p>Page content</p></RouteSkeleton>
 </MemoryRouter></LocaleProvider>);
 act(() => vi.advanceTimersByTime(1500));
 for (let click = 0; click < 2; click++) {
  fireEvent.click(screen.getByRole('link', { name: 'Security' }));
  expect(screen.getByRole('status')).toBeTruthy();
  act(() => vi.advanceTimersByTime(1499));
  expect(screen.getByRole('status')).toBeTruthy();
  act(() => vi.advanceTimersByTime(1));
  expect(screen.queryByRole('status')).toBeNull();
 }
});
