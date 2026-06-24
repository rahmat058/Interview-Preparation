import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '../src/data/file-tree.json')

let nodeCounter = 0

function nextId(prefix) {
  nodeCounter += 1
  return `${prefix}_${String(nodeCounter).padStart(3, '0')}`
}

function isoDate(daysAgo) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(10 + (daysAgo % 8), (daysAgo * 11) % 60, 0, 0)
  return d.toISOString()
}

function fileNode(name, parentPath, extension, sizeKb, daysAgo) {
  const path = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`
  return {
    id: nextId('file'),
    name,
    type: 'file',
    path,
    extension,
    sizeBytes: sizeKb * 1024,
    modifiedAt: isoDate(daysAgo),
  }
}

function folderNode(name, parentPath, children, daysAgo = 5) {
  const path = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`
  return {
    id: nextId('dir'),
    name,
    type: 'folder',
    path,
    modifiedAt: isoDate(daysAgo),
    children,
  }
}

function countNodes(node) {
  if (node.type === 'file') return 1
  return 1 + (node.children ?? []).reduce((sum, child) => sum + countNodes(child), 0)
}

function countFolders(node) {
  if (node.type === 'file') return 0
  return 1 + (node.children ?? []).reduce((sum, child) => sum + countFolders(child), 0)
}

const tree = folderNode('react-interview-prep', '/', [
  folderNode('public', '/react-interview-prep', [
    fileNode('vite.svg', '/react-interview-prep/public', 'svg', 2, 30),
    fileNode('favicon.ico', '/react-interview-prep/public', 'ico', 4, 45),
    fileNode('robots.txt', '/react-interview-prep/public', 'txt', 1, 60),
  ], 20),
  folderNode('src', '/react-interview-prep', [
    fileNode('main.tsx', '/react-interview-prep/src', 'tsx', 1, 2),
    fileNode('App.tsx', '/react-interview-prep/src', 'tsx', 2, 2),
    fileNode('index.css', '/react-interview-prep/src', 'css', 3, 5),
    fileNode('vite-env.d.ts', '/react-interview-prep/src', 'ts', 1, 10),
    folderNode('api', '/react-interview-prep/src', [
      fileNode('searchApi.ts', '/react-interview-prep/src/api', 'ts', 4, 3),
      fileNode('feedApi.ts', '/react-interview-prep/src/api', 'ts', 5, 4),
      fileNode('explorerApi.ts', '/react-interview-prep/src/api', 'ts', 6, 1),
    ], 4),
    folderNode('components', '/react-interview-prep/src', [
      folderNode('search', '/react-interview-prep/src/components', [
        fileNode('AutocompleteSearch.tsx', '/react-interview-prep/src/components/search', 'tsx', 8, 6),
        fileNode('SearchDropdown.tsx', '/react-interview-prep/src/components/search', 'tsx', 5, 6),
        fileNode('SearchResultItem.tsx', '/react-interview-prep/src/components/search', 'tsx', 3, 7),
        fileNode('EntityTypeFilter.tsx', '/react-interview-prep/src/components/search', 'tsx', 4, 8),
      ], 6),
      folderNode('feed', '/react-interview-prep/src/components', [
        fileNode('FeedList.tsx', '/react-interview-prep/src/components/feed', 'tsx', 6, 5),
        fileNode('FeedCard.tsx', '/react-interview-prep/src/components/feed', 'tsx', 4, 5),
        fileNode('FeedSkeleton.tsx', '/react-interview-prep/src/components/feed', 'tsx', 3, 9),
        fileNode('FeedLoadMore.tsx', '/react-interview-prep/src/components/feed', 'tsx', 2, 9),
      ], 5),
      folderNode('explorer', '/react-interview-prep/src/components', [
        fileNode('FileTree.tsx', '/react-interview-prep/src/components/explorer', 'tsx', 4, 1),
        fileNode('TreeNode.tsx', '/react-interview-prep/src/components/explorer', 'tsx', 5, 1),
        fileNode('TreeRow.tsx', '/react-interview-prep/src/components/explorer', 'tsx', 4, 1),
        fileNode('FileIcon.tsx', '/react-interview-prep/src/components/explorer', 'tsx', 3, 2),
        fileNode('FileDetailPanel.tsx', '/react-interview-prep/src/components/explorer', 'tsx', 6, 2),
        fileNode('ExplorerToolbar.tsx', '/react-interview-prep/src/components/explorer', 'tsx', 4, 2),
      ], 1),
      folderNode('layout', '/react-interview-prep/src/components', [
        fileNode('Header.tsx', '/react-interview-prep/src/components/layout', 'tsx', 2, 12),
        fileNode('Footer.tsx', '/react-interview-prep/src/components/layout', 'tsx', 2, 12),
      ], 12),
      folderNode('ui', '/react-interview-prep/src/components', [
        fileNode('Button.tsx', '/react-interview-prep/src/components/ui', 'tsx', 3, 15),
      ], 15),
    ], 3),
    folderNode('data', '/react-interview-prep/src', [
      fileNode('search-index.json', '/react-interview-prep/src/data', 'json', 48, 4),
      fileNode('feed-posts.json', '/react-interview-prep/src/data', 'json', 32, 5),
      fileNode('file-tree.json', '/react-interview-prep/src/data', 'json', 28, 1),
      fileNode('mockSearchIndex.ts', '/react-interview-prep/src/data', 'ts', 2, 4),
      fileNode('mockFeedPosts.ts', '/react-interview-prep/src/data', 'ts', 2, 5),
      fileNode('mockFileTree.ts', '/react-interview-prep/src/data', 'ts', 2, 1),
    ], 3),
    folderNode('hooks', '/react-interview-prep/src', [
      fileNode('useDebouncedSearch.ts', '/react-interview-prep/src/hooks', 'ts', 3, 7),
      fileNode('useInfiniteScroll.ts', '/react-interview-prep/src/hooks', 'ts', 4, 5),
      fileNode('useTreeKeyboardNav.ts', '/react-interview-prep/src/hooks', 'ts', 5, 1),
      fileNode('useClickOutside.ts', '/react-interview-prep/src/hooks', 'ts', 2, 10),
    ], 5),
    folderNode('lib', '/react-interview-prep/src', [
      folderNode('store', '/react-interview-prep/src/lib', [
        fileNode('index.ts', '/react-interview-prep/src/lib/store', 'ts', 1, 8),
        fileNode('hooks.ts', '/react-interview-prep/src/lib/store', 'ts', 1, 8),
        folderNode('slices', '/react-interview-prep/src/lib/store', [
          fileNode('searchSlice.ts', '/react-interview-prep/src/lib/store/slices', 'ts', 6, 6),
          fileNode('feedSlice.ts', '/react-interview-prep/src/lib/store/slices', 'ts', 5, 5),
          fileNode('explorerSlice.ts', '/react-interview-prep/src/lib/store/slices', 'ts', 7, 1),
        ], 6),
      ], 8),
      folderNode('types', '/react-interview-prep/src/lib', [
        fileNode('search.ts', '/react-interview-prep/src/lib/types', 'ts', 2, 9),
        fileNode('feed.ts', '/react-interview-prep/src/lib/types', 'ts', 2, 8),
        fileNode('explorer.ts', '/react-interview-prep/src/lib/types', 'ts', 3, 1),
      ], 9),
      folderNode('utils', '/react-interview-prep/src/lib', [
        fileNode('cn.ts', '/react-interview-prep/src/lib/utils', 'ts', 1, 20),
        fileNode('treeHelpers.ts', '/react-interview-prep/src/lib/utils', 'ts', 5, 1),
        fileNode('entityHelpers.ts', '/react-interview-prep/src/lib/utils', 'ts', 3, 11),
      ], 11),
    ], 8),
  ], 2),
  folderNode('scripts', '/react-interview-prep', [
    fileNode('generate-search-index.mjs', '/react-interview-prep/scripts', 'mjs', 6, 4),
    fileNode('generate-feed-posts.mjs', '/react-interview-prep/scripts', 'mjs', 5, 5),
    fileNode('generate-file-tree.mjs', '/react-interview-prep/scripts', 'mjs', 7, 1),
  ], 3),
  folderNode('docs', '/react-interview-prep', [
    fileNode('ARCHITECTURE.md', '/react-interview-prep/docs', 'md', 12, 2),
    fileNode('INTERVIEW-QUESTIONS.md', '/react-interview-prep/docs', 'md', 8, 2),
    fileNode('README.md', '/react-interview-prep/docs', 'md', 4, 3),
    folderNode('diagrams', '/react-interview-prep/docs', [
      fileNode('tree-recursion.svg', '/react-interview-prep/docs/diagrams', 'svg', 6, 10),
      fileNode('data-flow.png', '/react-interview-prep/docs/diagrams', 'png', 120, 10),
    ], 10),
  ], 3),
  folderNode('.github', '/react-interview-prep', [
    folderNode('workflows', '/react-interview-prep/.github', [
      fileNode('ci.yml', '/react-interview-prep/.github/workflows', 'yml', 2, 14),
      fileNode('deploy.yml', '/react-interview-prep/.github/workflows', 'yml', 3, 14),
    ], 14),
  ], 14),
  fileNode('package.json', '/react-interview-prep', 'json', 2, 1),
  fileNode('tsconfig.json', '/react-interview-prep', 'json', 1, 8),
  fileNode('vite.config.ts', '/react-interview-prep', 'ts', 1, 8),
  fileNode('eslint.config.js', '/react-interview-prep', 'js', 1, 10),
  fileNode('.gitignore', '/react-interview-prep', 'gitignore', 1, 20),
  fileNode('.env.example', '/react-interview-prep', 'example', 1, 15),
], 1)

const totalNodes = countNodes(tree)
const totalFolders = countFolders(tree)
const totalFiles = totalNodes - totalFolders

const payload = {
  meta: {
    schemaVersion: '1.0.0',
    collection: 'file_system_tree',
    rootPath: tree.path,
    totalNodes,
    totalFolders,
    totalFiles,
    generatedAt: new Date().toISOString(),
  },
  data: tree,
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

console.log(`Wrote ${totalNodes} nodes (${totalFolders} folders, ${totalFiles} files) → ${outPath}`)
