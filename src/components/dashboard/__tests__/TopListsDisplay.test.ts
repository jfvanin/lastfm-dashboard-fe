import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TopListsDisplay from '../displays/TopListsDisplay.vue'
import type { Top5Statistics } from '@/api/api'

describe('TopListsDisplay', () => {
  const mockTop5Data: Top5Statistics = {
    top5ScrobbleDays: [
      {
        _id: {
          year: 2023,
          month: 6,
          day: 15,
          artist: { mbid: '123', '#text': 'Test Artist' }
        },
        count: 50
      }
    ],
    top5Streaks: [],
    top5MostScrobbleArtists: [
      {
        artist: { mbid: '789', '#text': 'Top Artist 1' },
        count: 1000
      },
      {
        artist: { mbid: '456', '#text': 'Top Artist 2' },
        count: 800
      }
    ],
    top5MostScrobbleAlbums: [
      {
        album: { mbid: '345', '#text': 'Top Album 1' },
        count: 500
      }
    ],
    top5MostScrobbleTracks: [
      {
        name: 'Top Track 1',
        count: 200
      }
    ]
  }

  it('renders the component', () => {
    const wrapper = mount(TopListsDisplay, {
      props: { listTop5: mockTop5Data }
    })
    
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the main title correctly', () => {
    const wrapper = mount(TopListsDisplay, {
      props: { listTop5: mockTop5Data }
    })

    const title = wrapper.find('h2')
    expect(title.text()).toBe('Top 5 Days with Most Scrobbles from Same Artist')
  })

  it('renders scrobble days correctly', () => {
    const wrapper = mount(TopListsDisplay, {
      props: { listTop5: mockTop5Data }
    })

    const scrobbleDaysList = wrapper.find('ul')
    const listItems = scrobbleDaysList.findAll('li')
    expect(listItems).toHaveLength(1)
    expect(listItems[0].text()).toContain('Test Artist')
    expect(listItems[0].text()).toContain('50 scrobbles')
  })

  it('handles empty data gracefully', () => {
    const emptyData: Top5Statistics = {
      top5ScrobbleDays: [],
      top5Streaks: [],
      top5MostScrobbleArtists: [],
      top5MostScrobbleAlbums: [],
      top5MostScrobbleTracks: []
    }

    const wrapper = mount(TopListsDisplay, {
      props: { listTop5: emptyData }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h2').text()).toBe('Top 5 Days with Most Scrobbles from Same Artist')
    
    // Should render empty lists
    const listItems = wrapper.findAll('li')
    expect(listItems).toHaveLength(0)
  })
})
