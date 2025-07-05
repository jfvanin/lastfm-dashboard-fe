import { describe, it, expect } from 'vitest';
import { processDecadeData, processCountryData, processTagData } from '../chartHelpers';

describe('chartHelpers', () => {
    describe('processDecadeData', () => {
        it('should process decade data correctly', () => {
            const mockResponse = [
                {
                    _id: '2020',
                    decades: [
                        { decade: '2000s', count: 15 },
                        { decade: '2010s', count: 25 }
                    ]
                },
                {
                    _id: '2021',
                    decades: [
                        { decade: '2000s', count: 10 },
                        { decade: '1990s', count: 5 }
                    ]
                }
            ];
            const categories = ['2020', '2021'];

            const result = processDecadeData(mockResponse, categories);

            expect(result).toHaveLength(7); // 7 decades defined in function

            const decade2000s = result.find(item => item.name === '2000s');
            expect(decade2000s?.data).toEqual([15, 10]);

            const decade2010s = result.find(item => item.name === '2010s');
            expect(decade2010s?.data).toEqual([25, 0]);

            const decade1990s = result.find(item => item.name === '1990s');
            expect(decade1990s?.data).toEqual([0, 5]);
        });

        it('should handle empty response', () => {
            const result = processDecadeData([], ['2020']);
            expect(result).toHaveLength(7);

            result.forEach(decade => {
                expect(decade.data).toEqual([0]);
            });
        });
    });

    describe('processCountryData', () => {
        it('should process country data correctly', () => {
            const mockResponse = [
                {
                    _id: '2020',
                    countries: [
                        { artistCountry: 'USA', count: 50 },
                        { artistCountry: 'UK', count: 30 }
                    ]
                },
                {
                    _id: '2021',
                    countries: [
                        { artistCountry: 'USA', count: 45 },
                        { artistCountry: 'Germany', count: 20 }
                    ]
                }
            ];
            const categories = ['2020', '2021'];

            const result = processCountryData(mockResponse, categories);

            expect(result).toHaveLength(3); // USA, UK, Germany

            const usa = result.find(item => item.name === 'USA');
            expect(usa?.data).toEqual([50, 45]);

            const uk = result.find(item => item.name === 'UK');
            expect(uk?.data).toEqual([30, 0]);

            const germany = result.find(item => item.name === 'Germany');
            expect(germany?.data).toEqual([0, 20]);
        });
    });

    describe('processTagData', () => {
        it('should process tag data correctly', () => {
            const mockResponse = [
                {
                    _id: '2020',
                    tags: [
                        { tag: 'rock', count: 100 },
                        { tag: 'pop', count: 80 }
                    ]
                },
                {
                    _id: '2021',
                    tags: [
                        { tag: 'rock', count: 90 },
                        { tag: 'electronic', count: 60 }
                    ]
                }
            ];
            const categories = ['2020', '2021'];

            const result = processTagData(mockResponse, categories);

            expect(result).toHaveLength(3); // rock, pop, electronic

            const rock = result.find(item => item.name === 'rock');
            expect(rock?.data).toEqual([100, 90]);

            const pop = result.find(item => item.name === 'pop');
            expect(pop?.data).toEqual([80, 0]);

            const electronic = result.find(item => item.name === 'electronic');
            expect(electronic?.data).toEqual([0, 60]);
        });
    });
});
