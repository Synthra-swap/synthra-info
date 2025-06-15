import { useState, useEffect } from 'react'

// endpoint to check asset exists
const cmcEndpoint = 'https://3rdparty-apis.coinmarketcap.com/v1/cryptocurrency/contract?address='

/**
 * Check if asset exists on CMC, if exists
 * return  url, if not return undefined
 * @param address token address
 */
export function useCMCLink(address: string): string | undefined {
  const [link, setLink] = useState<string | undefined>(undefined)

  useEffect(() => {
    async function fetchLink() {
      try {
        const result = await fetch(cmcEndpoint + address)
        // if link exists, format the url
        if (result.status === 200) {
          const json = await result.json()
          if (json.data?.url) {
            setLink(json.data.url)
          }
        }
      } catch (error) {
        // Silently fail - CMC link is non-critical functionality
        console.debug('Failed to fetch CMC link:', error)
      }
    }
    if (address) {
      fetchLink()
    }
  }, [address])

  return link
}
