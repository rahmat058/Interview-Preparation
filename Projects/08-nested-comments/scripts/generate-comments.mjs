import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '../src/data/comments.json')

let commentCounter = 0

function nextId() {
  commentCounter += 1
  return `cmt_${String(commentCounter).padStart(3, '0')}`
}

function isoDate(hoursAgo) {
  const d = new Date()
  d.setHours(d.getHours() - hoursAgo)
  return d.toISOString()
}

const authors = [
  { id: 'usr_01', username: 'react_architect', avatarColor: '#ea580c' },
  { id: 'usr_02', username: 'hooks_enjoyer', avatarColor: '#f97316' },
  { id: 'usr_03', username: 'redux_purist', avatarColor: '#f43f5e' },
  { id: 'usr_04', username: 'tailwind_fan', avatarColor: '#fb7185' },
  { id: 'usr_05', username: 'senior_dev_42', avatarColor: '#c2410c' },
  { id: 'usr_06', username: 'junior_on_fire', avatarColor: '#e11d48' },
  { id: 'usr_07', username: 'system_design_guru', avatarColor: '#9a3412' },
  { id: 'usr_08', username: 'frontend_lead', avatarColor: '#be123c' },
]

function pickAuthor(index) {
  return authors[index % authors.length]
}

function comment(body, authorIndex, hoursAgo, score, replies = []) {
  const id = nextId()
  return {
    id,
    parentId: null,
    postId: 'post_001',
    author: pickAuthor(authorIndex),
    body,
    score,
    createdAt: isoDate(hoursAgo),
    replyCount: countTree(replies),
    replies,
  }
}

function reply(body, authorIndex, hoursAgo, score, replies = []) {
  const id = nextId()
  return {
    id,
    parentId: null,
    postId: 'post_001',
    author: pickAuthor(authorIndex),
    body,
    score,
    createdAt: isoDate(hoursAgo),
    replyCount: countTree(replies),
    replies,
  }
}

function countTree(nodes) {
  return nodes.reduce((sum, node) => sum + 1 + countTree(node.replies ?? []), 0)
}

function maxDepth(nodes, depth = 1) {
  if (!nodes.length) return depth - 1
  return Math.max(...nodes.map((node) => maxDepth(node.replies ?? [], depth + 1)))
}

function assignParentIds(nodes, parentId = null) {
  for (const node of nodes) {
    node.parentId = parentId
    if (node.replies?.length) {
      assignParentIds(node.replies, node.id)
    }
  }
}

const threads = [
  comment(
    'For machine coding rounds, I always start by defining the Comment type and whether the API returns a nested tree or a flat list. Nested is easier to render recursively; flat is easier to mutate.',
    0,
    48,
    284,
    [
      reply(
        'Flat list + buildTree() is what Reddit actually uses internally. You get O(1) inserts and easier pagination of "load more replies".',
        1,
        44,
        156,
        [
          reply(
            'Do you rebuild the whole tree on every new reply, or patch the subtree?',
            2,
            42,
            67,
            [
              reply(
                'Patch the subtree. Keep a Map<id, Comment> for lookups, then attach to parent.replies. O(depth) not O(n).',
                4,
                40,
                41,
              ),
            ],
          ),
          reply(
            'Interviewers often give you nested JSON though — so know both approaches.',
            6,
            41,
            89,
          ),
        ],
      ),
      reply(
        'Recursive CommentNode is the same pattern as a file tree. Base case: no replies. Recursive case: map replies to CommentNode.',
        3,
        43,
        198,
        [
          reply(
            'Exactly. Split CommentRow (UI) from CommentNode (recursion) — same as TreeRow/TreeNode in a file explorer.',
            7,
            39,
            112,
          ),
        ],
      ),
    ],
  ),
  comment(
    'Expand/collapse state should NOT live inside the comment data from the server. Keep expandedIds as client UI state keyed by comment id.',
    5,
    36,
    173,
    [
      reply(
        'Yes — otherwise you mutate API payload and can\'t reset UI without refetch.',
        0,
        34,
        94,
      ),
      reply(
        'Default expand depth 2, then let users collapse threads. Reddit does this with "collapsed" author lines.',
        2,
        33,
        78,
        [
          reply('You can also persist collapsed state in localStorage per thread.', 1, 31, 45),
        ],
      ),
    ],
  ),
  comment(
    'Don\'t forget the left border thread line — visual depth matters for UX in nested comments.',
    4,
    28,
    121,
    [
      reply('paddingLeft: depth * 16 plus border-l-2 is the classic pattern.', 3, 26, 58),
    ],
  ),
  comment(
    'For replies, optimistic UI: push to tree immediately, rollback on API failure. Shows you understand async state.',
    6,
    20,
    97,
  ),
  comment(
    'Sorting top-level comments by score vs createdAt is a good follow-up question. Re-sort only roots; keep reply order stable.',
    7,
    12,
    64,
    [
      reply('Stable sort within each sibling group — don\'t re-sort entire tree recursively on every vote.', 5, 10, 38),
    ],
  ),
]

assignParentIds(threads)

const totalComments = countTree(threads)
const payload = {
  meta: {
    schemaVersion: '1.0.0',
    collection: 'comments',
    postId: 'post_001',
    totalComments,
    topLevelCount: threads.length,
    maxDepth: maxDepth(threads),
    generatedAt: new Date().toISOString(),
  },
  post: {
    id: 'post_001',
    title: 'How do you structure nested comments in a React machine coding round?',
    subreddit: 'r/reactjs',
    author: pickAuthor(0),
    body: 'I have a frontend interview next week and nested comments (Reddit-style) is a common prompt. Curious how you would architect recursive rendering, replies, and expand/collapse without over-engineering.',
    score: 1247,
    commentCount: totalComments,
    createdAt: isoDate(72),
  },
  data: threads,
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`)
console.log(`Wrote ${totalComments} comments (${threads.length} top-level) → ${outPath}`)
