import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TopListsDisplay from '../displays/TopListsDisplay.vue';
import type { Top5Statistics } from '@/api/api';

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
            },
            {
                _id: {
                    year: 2023,
                    month: 8,
                    day: 22,
                    artist: { mbid: '456', '#text': 'Another Artist' }
                },
                count: 45
            }
        ],
        top5Streaks: [],
        top5MostScrobbleArtists: [
            {
                artist: { mbid: '789', '#text': 'Top Artist 1' },
                count: 1000
            },
            {
                artist: { mbid: '012', '#text': 'Top Artist 2' },
                count: 800
            }
        ],
        top5MostScrobbleAlbums: [
            {
                album: { mbid: '345', '#text': 'Top Album 1' },
                count: 500
            },
            {
                album: { mbid: '678', '#text': 'Top Album 2' },
                count: 400
            }
        ],
        top5MostScrobbleTracks: [
            {
                name: 'Top Track 1',
                count: 200
            },
            {
                name: 'Top Track 2',
                count: 180
            }
        ]
    };

    it('renders top 5 scrobble days correctly', () => {
        const wrapper = mount(TopListsDisplay, {
            props: { listTop5: mockTop5Data }
        });

        const daysList = wrapper.find('ul').findAll('li');
        expect(daysList).toHaveLength(2);

        // Check first day
        expect(daysList[0].text()).toContain('Test Artist');
        expect(daysList[0].text()).toContain('15/6/2023');
        expect(daysList[0].text()).toContain('50 scrobbles');

        // Check second day
        expect(daysList[1].text()).toContain('Another Artist');
        expect(daysList[1].text()).toContain('22/8/2023');
        expect(daysList[1].text()).toContain('45 scrobbles');
    });

    it('renders top 5 artists correctly', () => {
        const wrapper = mount(TopListsDisplay, {
            props: { listTop5: mockTop5Data }
        });

        const artistsSection = wrapper.findAll('.bg-gray-800')[0];
        expect(artistsSection.find('h2').text()).toBe('Top 5 Artists');

        const artistItems = artistsSection.findAll('li');
        expect(artistItems).toHaveLength(2);

        expect(artistItems[0].text()).toContain('Top Artist 1');
        expect(artistItems[0].text()).toContain('1000 scrobbles');

        expect(artistItems[1].text()).toContain('Top Artist 2');
        expect(artistItems[1].text()).toContain('800 scrobbles');
    });

    it('renders top 5 albums correctly', () => {
        const wrapper = mount(TopListsDisplay, {
            props: { listTop5: mockTop5Data }
        });

        const albumsSection = wrapper.findAll('.bg-gray-800')[1];
        expect(albumsSection.find('h2').text()).toBe('Top 5 Albums');

        const albumItems = albumsSection.findAll('li');
        expect(albumItems).toHaveLength(2);

        expect(albumItems[0].text()).toContain('Top Album 1');
        expect(albumItems[0].text()).toContain('500 scrobbles');
    });

    it('renders top 5 tracks correctly', () => {
        const wrapper = mount(TopListsDisplay, {
            props: { listTop5: mockTop5Data }
        });

        const tracksSection = wrapper.findAll('.bg-gray-800')[2];
        expect(tracksSection.find('h2').text()).toBe('Top 5 Tracks');

        const trackItems = tracksSection.findAll('li');
        expect(trackItems).toHaveLength(2);

        expect(trackItems[0].text()).toContain('Top Track 1');
        expect(trackItems[0].text()).toContain('200 scrobbles');
    });

    it('handles empty data gracefully', () => {
        const emptyData: Top5Statistics = {
            top5ScrobbleDays: [],
            top5Streaks: [],
            top5MostScrobbleArtists: [],
            top5MostScrobbleAlbums: [],
            top5MostScrobbleTracks: []
        };

        const wrapper = mount(TopListsDisplay, {
            props: { listTop5: emptyData }
        });

        // Should still render the structure but with no list items
        expect(wrapper.find('h2').text()).toBe('Top 5 Days with Most Scrobbles from Same Artist');
        expect(wrapper.findAll('.bg-gray-800')).toHaveLength(3);
    });

    it('applies correct CSS classes for layout', () => {
        const wrapper = mount(TopListsDisplay, {
            props: { listTop5: mockTop5Data }
        });

        // Check main container classes
        const topListContainer = wrapper.find('#topList');
        expect(topListContainer.classes()).toContain('flex');
        expect(topListContainer.classes()).toContain('flex-col');
        expect(topListContainer.classes()).toContain('m-6');

        // Check scrobble days list classes
        const daysList = wrapper.find('ul');
        expect(daysList.classes()).toContain('flex');
        expect(daysList.classes()).toContain('flex-wrap');
        expect(daysList.classes()).toContain('gap-4');
    });

    it('displays proper date formatting', () => {
        const wrapper = mount(TopListsDisplay, {
            props: { listTop5: mockTop5Data }
        });

        const dayItems = wrapper.find('ul').findAll('li');

        // Check date formatting: day/month/year
        expect(dayItems[0].text()).toContain('15/6/2023');
        expect(dayItems[1].text()).toContain('22/8/2023');
    });

    it('handles component prop changes', () => {
        const wrapper = mount(TopListsDisplay, {
            props: { listTop5: mockTop5Data }
        });

        expect(wrapper.exists()).toBe(true);

        // Change props
        const newData: Top5Statistics = {
            top5ScrobbleDays: [],
            top5Streaks: [],
            top5MostScrobbleArtists: [{
                artist: { mbid: 'new', '#text': 'New Artist' },
                count: 999
            }],
            top5MostScrobbleAlbums: [],
            top5MostScrobbleTracks: []
        };

        wrapper.setProps({ listTop5: newData });

        // Should still exist and update
        expect(wrapper.exists()).toBe(true);
        const artistsSection = wrapper.findAll('.bg-gray-800')[0];
        const artistItems = artistsSection.findAll('li');
        expect(artistItems).toHaveLength(1);
        expect(artistItems[0].text()).toContain('New Artist');
        expect(artistItems[0].text()).toContain('999 scrobbles');
    });
});
