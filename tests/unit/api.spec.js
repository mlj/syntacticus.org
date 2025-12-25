import api, { SYNTACTICUS_API_BASE, STATIC_FILE_BASE } from '@/api/index.js'

global.fetch = vi.fn()

describe('API Service', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('handles JSON responses correctly', async () => {
    const mockJson = { some: 'data' }
    fetch.mockResolvedValueOnce({
      ok: true,
      url: 'http://test.url',
      headers: {
        get: vi.fn().mockReturnValue('application/json; charset=utf-8')
      },
      json: vi.fn().mockResolvedValueOnce(mockJson),
      text: vi.fn()
    })

    const response = await api.getDictionaries()
    expect(response.data).toEqual(mockJson)
    expect(response.request.responseURL).toBe('http://test.url')
  })

  it('handles Text/SVG responses correctly', async () => {
    const mockText = '<svg>...</svg>'
    fetch.mockResolvedValueOnce({
      ok: true,
      url: 'http://test.url',
      headers: {
        get: vi.fn().mockReturnValue('image/svg+xml')
      },
      json: vi.fn(),
      text: vi.fn().mockResolvedValueOnce(mockText)
    })

    const response = await api.getGraph('test:gid')
    expect(response.data).toBe(mockText)
    expect(response.request.responseURL).toBe('http://test.url')
  })

  it('handles network errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: { get: vi.fn() }
    })

    await expect(api.getDictionaries()).rejects.toThrow('Not Found')
  })

  it('handles JSON responses without content-type header safely (fallback to text or try json?)', async () => {
    // Current logic: if content-type includes 'json', use json(), else text().
    // If header is missing, it falls back to text().
    // This is safe for now as our API is consistent, but worth testing the behavior.
    const mockText = 'some text'
    fetch.mockResolvedValueOnce({
      ok: true,
      url: 'http://test.url',
      headers: {
        get: vi.fn().mockReturnValue(null)
      },
      text: vi.fn().mockResolvedValueOnce(mockText)
    })

    const response = await api.getDictionaries()
    expect(response.data).toBe(mockText)
  })
})
