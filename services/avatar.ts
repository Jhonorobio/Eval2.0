// Small helper to provide a default avatar when none is present.
export const DEFAULT_AVATAR = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'>
    <circle cx='12' cy='8' r='3.2' />
    <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
  </svg>
`);

export const getAvatar = (avatar?: string | null) => {
  if (!avatar) return DEFAULT_AVATAR;
  return avatar;
};
