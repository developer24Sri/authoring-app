export const STORAGE_KEYS = {
  TREE:             'authoring-tree',
  THEME:            'authoring-theme',
  INVITED_MEMBERS:  'authoring-invited-members',
  COMMENTS_PREFIX:  'comments-',
} as const

export const MOCK_USER = {
  name:   'John Doe',
  email:  'john@example.com',
  avatar: 'JD',
} as const

export const NODE_LABELS = {
  DEFAULT_CONTAINER: 'New Section',
  DEFAULT_LEAF:      'New Item',
  ROOT:              'My Course',
} as const

export const EDITOR_CONFIG = {
  DEBOUNCE_MS:      300,
  PLACEHOLDER_TEXT: 'Start writing, or press + to insert content…',
} as const

export const TREE_CONFIG = {
  ROOT_ID:          'root',
  INDENT_PX:        16,
} as const