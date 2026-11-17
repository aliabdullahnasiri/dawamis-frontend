import type { UserData } from '../../api/generated';
export function fullName(user?: UserData) {
 return [user?.first_name, user?.middle_name, user?.last_name].map(value => value?.trim()).filter(Boolean).join(' ') || user?.user_name || '';
}
export function initials(name: string) {
 const words = name.trim().split(/\s+/).filter(Boolean);
 const chosen = words.length > 1 ? [words[0], words[words.length - 1]] : words;
 return chosen.map(word => Array.from(word)[0]).join('').toLocaleUpperCase();
}
