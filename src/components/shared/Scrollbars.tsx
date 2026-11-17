import { useEffect } from 'react';
import PerfectScrollbar from 'perfect-scrollbar';
import { useLocale } from '../../i18n/locale';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import './scrollbars.css';

const scrollable = /^(auto|scroll|overlay)$/;
const isRail = (element: Element) => !!element.closest('.ps__rail-x, .ps__rail-y');
const withoutScrollbarClasses = (value: string) => value.split(/\s+/).filter(name => !name.startsWith('ps')).join(' ');

/** Enhances page, nested, and portalled scroll containers without extra wrappers. */
export default function Scrollbars() {
 const { direction } = useLocale();
 useEffect(() => {
  const instances = new Map<HTMLElement, { scrollbar: PerfectScrollbar; position: string; addedPosition: boolean }>();
  let frame = 0;
  let stopped = false;
  const schedule = () => {
   if (!frame && !stopped) frame = requestAnimationFrame(refresh);
  };
  const sizes = new ResizeObserver(schedule);
  const observed = new Set<Element>();
  const refresh = () => {
   frame = 0;
   // Disconnect during our own DOM writes so scrollbar rails do not cause an update loop.
   changes.disconnect();
   const nextObserved = new Set<Element>();
   for (const [element, instance] of instances) {
    if (!element.isConnected) { instance.scrollbar.destroy(); instances.delete(element); }
   }
   for (const element of document.body.querySelectorAll<HTMLElement>('*')) {
    if (isRail(element) || /^(INPUT|TEXTAREA|SELECT|SVG|PATH)$/.test(element.tagName)) continue;
    if (instances.has(element)) continue;
    const style = getComputedStyle(element);
    if (!scrollable.test(style.overflowX) && !scrollable.test(style.overflowY)) continue;
    const position = element.style.position;
    const addedPosition = style.position === 'static';
    if (addedPosition) element.style.position = 'relative';
    const scrollbar = new PerfectScrollbar(element, {
     wheelPropagation: true,
     minScrollbarLength: 28,
     // Ignore fractional layout rounding; scroll only when content really overflows.
     scrollXMarginOffset: 2,
     scrollYMarginOffset: 2,
     suppressScrollX: !scrollable.test(style.overflowX),
     suppressScrollY: !scrollable.test(style.overflowY),
    });
    instances.set(element, { scrollbar, position, addedPosition });
   }
   for (const [element, { scrollbar }] of instances) {
    scrollbar.update();
    nextObserved.add(element);
    for (const child of element.children) if (!isRail(child)) nextObserved.add(child);
   }
   for (const target of observed) if (!nextObserved.has(target)) { sizes.unobserve(target); observed.delete(target); }
   for (const target of nextObserved) if (!observed.has(target)) { sizes.observe(target); observed.add(target); }
   changes.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'style', 'hidden', 'open', 'dir'], attributeOldValue: true });
  };
  const changes = new MutationObserver(records => {
   if (records.some(record => {
    const target = record.target instanceof Element ? record.target : record.target.parentElement;
    if (!target || isRail(target)) return false;
    if (record.type === 'attributes' && record.attributeName === 'class') return withoutScrollbarClasses(record.oldValue || '') !== withoutScrollbarClasses(target.getAttribute('class') || '');
    return true;
   })) schedule();
  });
  refresh();
  window.addEventListener('resize', schedule);
  document.addEventListener('load', schedule, true);
  document.addEventListener('transitionend', schedule, true);
  void document.fonts?.ready.then(() => { if (!stopped) schedule(); });
  return () => {
   stopped = true;
   cancelAnimationFrame(frame);
   changes.disconnect(); sizes.disconnect();
   window.removeEventListener('resize', schedule);
   document.removeEventListener('load', schedule, true);
   document.removeEventListener('transitionend', schedule, true);
   for (const [element, { scrollbar, position, addedPosition }] of instances) {
    scrollbar.destroy();
    if (addedPosition) element.style.position = position;
   }
  };
 }, [direction]);
 return null;
}
