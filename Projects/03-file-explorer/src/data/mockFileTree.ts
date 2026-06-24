import fileTreePayload from '@/data/file-tree.json'
import type { FileTreeResponse } from '@/lib/types/explorer'

const typedPayload = fileTreePayload as FileTreeResponse

export function getMockFileTree(): FileTreeResponse {
  return typedPayload
}
