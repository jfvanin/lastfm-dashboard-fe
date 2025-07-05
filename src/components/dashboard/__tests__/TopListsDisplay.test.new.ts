import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TopListsDisplay from '../displays/TopListsDisplay.vue';
import type { Top5Statistics } from '@/api/api';

describe('TopListsDisplay', () => {
    // Helper function to find sections by heading text
    const findSectionByHeading = (wrapper: ReturnType<typeof mount>, headingText: string) => {
        return wrapper.findAll('div').find((div) => {
            const h2 = div.find('h2');
            return h2.exists() && h2.text() === headingText;
        });
    };

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
    };

    it('renders the main title correctly', () => {
        const wrapper = mount(TopListsDisplay, {
            props: { listTop5: mockTop5Data }
        });

        const title = wrapper.find('h2');
        expect(title.text()).toBe('Top 5 Days with Most Scrobbles from Same Artist');
        expect(title.classes()).toContain('text-2xl');
        expect(title.classes()).toContain('font-bold');
        expect(title.classes()).toContain('text-white');
    });

    it('renders top 5 artists correctly', () => {
        const wrapper = mount(TopListsDisplay, {
            props: { listTop5: mockTop5Data }
        });

        const artistsSection = findSectionByHeading(wrapper, 'Top 5 Artists');
        expect(artistsSection).toBeDefined();
        expect(artistsSection!.find('h2').text()).toBe('Top 5 Artists');

        const artistItems = artistsSection!.findAll('li');
        expect(artistItems).toHaveLength(1);
        expect(artistItems[0].text()).toContain('Top Artist 1');
        expect(artistItems[0].text()).toContain('1000 scrobbles');
    });

    it('renders top 5 albums correctly', () => {
        const wrapper = mount(TopListsDisplay, {
            props: { listTop5: mockTop5Data }
        });

        const albumsSection = findSectionByHeading(wrapper, 'Top 5 Albums');
        expect(albumsSection).toBeDefined();
        expect(albumsSection!.find('h2').text()).toBe('Top 5 Albums');

        const albumItems = albumsSection!.findAll('li');
        expect(albumItems).toHaveLength(1);
        expect(albumItems[0].text()).toContain('Top Album 1');
        expect(albumItems[0].text()).toContain('500 scrobbles');
    });

    it('renders top 5 tracks correctly', () => {
        const wrapper = mount(TopListsDisplay, {
            props: { listTop5: mockTop5Data }
        });

        const tracksSection = findSectionByHeading(wrapper, 'Top 5 Tracks');
        expect(tracksSection).toBeDefined();
        expect(tracksSection!.find('h2').text()).toBe('Top 5 Tracks');

        const trackItems = tracksSection!.findAll('li');
        expect(trackItems).toHaveLength(1);
        expect(trackItems[0].text()).toContain('Top Track 1');
        expect(trackItems[0].text()).toContain('200 scrobbles');
    });
});
