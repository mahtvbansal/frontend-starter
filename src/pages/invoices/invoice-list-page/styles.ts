export const CREATE_BUTTON_SX = { width: { xs: '100%', md: 'auto' } } as const;

export const FILTER_PAPER_SX = { p: { xs: 1.5, sm: 2 }, borderRadius: 4 } as const;

export const FILTER_CHIPS_STACK_SX = {
  flexWrap: { xs: 'wrap', md: 'nowrap' },
  overflowX: { xs: 'visible', md: 'auto' },
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none',
} as const;

export const STATUS_FILTER_CHIP_SX = {
  borderRadius: 999,
  fontWeight: 600,
  px: 0.5,
  whiteSpace: 'nowrap',
} as const;

export const DESKTOP_TABLE_PAPER_SX = {
  borderRadius: 4,
  overflow: 'hidden',
  display: { xs: 'none', md: 'block' },
} as const;

export const MOBILE_LIST_STACK_SX = { display: { xs: 'flex', md: 'none' } } as const;

export const MOBILE_CARD_SX = {
  p: 2,
  borderRadius: 3,
  cursor: 'pointer',
  transition: 'box-shadow 0.2s ease',
  '&:active': {
    boxShadow: (theme: { shadows: string[] }) => theme.shadows[2],
  },
} as const;

export const MOBILE_PAGINATION_PAPER_SX = { borderRadius: 3, overflow: 'hidden' } as const;
