import { useEffect } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { LocaleProvider, useLocale } from '../src/i18n/locale';
import { PageLoading, PAGE_LOADING_DELAY } from '../src/components/shared/PageLoading';

afterEach(() => { cleanup(); vi.useRealTimers(); localStorage.clear(); });
function Controls() {
 const navigate = useNavigate();
 const { setLocale } = useLocale();
 return <><button onClick={() => navigate('/account/security')}>Security</button><button onClick={() => setLocale('fa')}>Dari</button></>;
}
function Content({ start }: { start: () => void }) {
 useEffect(() => { start(); }, [start]);
 return <input aria-label="Page input" defaultValue="Preserve this"/>;
}
function mount(start = vi.fn()) {
 return render(<LocaleProvider><MemoryRouter initialEntries={['/profile']}><Controls/><PageLoading kind="profile"><Content start={start}/></PageLoading></MemoryRouter></LocaleProvider>);
}
test('skeleton delays presentation while the page mounts and starts its work immediately', () => {
 vi.useFakeTimers();const start=vi.fn();mount(start);
 expect(start).toHaveBeenCalledTimes(1);expect(screen.getByRole('status')).toBeTruthy();expect(screen.queryByRole('textbox')).toBeNull();
 act(() => vi.advanceTimersByTime(PAGE_LOADING_DELAY-1));expect(screen.queryByRole('textbox')).toBeNull();
 act(() => vi.advanceTimersByTime(1));expect(screen.queryByRole('status')).toBeNull();expect(screen.getByRole('textbox',{name:'Page input'})).toBeTruthy();
});
test('changing language preserves input state without replaying the skeleton', () => {
 vi.useFakeTimers();mount();act(() => vi.advanceTimersByTime(PAGE_LOADING_DELAY));
 fireEvent.change(screen.getByRole('textbox'),{target:{value:'Edited value'}});fireEvent.click(screen.getByRole('button',{name:'Dari'}));
 expect(screen.queryByRole('status')).toBeNull();expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Edited value');
});
test('a new route gets its own delay and cancels the previous route timer', () => {
 vi.useFakeTimers();mount();act(() => vi.advanceTimersByTime(300));fireEvent.click(screen.getByRole('button',{name:'Security'}));
 act(() => vi.advanceTimersByTime(300));expect(screen.getByRole('status')).toBeTruthy();expect(screen.queryByRole('textbox')).toBeNull();
 act(() => vi.advanceTimersByTime(300));expect(screen.queryByRole('status')).toBeNull();expect(screen.getByRole('textbox')).toBeTruthy();
});
