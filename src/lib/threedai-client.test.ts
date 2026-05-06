import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeThreeDAIStatus } from '@/lib/threedai-client'

test('normalizeThreeDAIStatus maps service aliases', () => {
  assert.equal(normalizeThreeDAIStatus('QUEUED'), 'PENDING')
  assert.equal(normalizeThreeDAIStatus('RUNNING'), 'PROCESSING')
  assert.equal(normalizeThreeDAIStatus('FINISHED'), 'COMPLETED')
  assert.equal(normalizeThreeDAIStatus('FAILED'), 'FAILED')
})
