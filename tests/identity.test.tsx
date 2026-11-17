import { expect, test } from 'vitest';
import { initials } from '../src/components/auth/identity';
test.each([
 ['Ali Abdullah Nasiri', 'AN'],
 ['  Ali  ', 'A'],
 ['', ''],
 ['علی عبدالله ناصری', 'عن'],
])('avatar initials use the first and last names: %s', (name, expected) => {
 expect(initials(name)).toBe(expected);
});
