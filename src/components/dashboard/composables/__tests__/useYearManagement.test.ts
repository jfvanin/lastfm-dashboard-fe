import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useYearManagement } from '../useYearManagement';

// Mock the API
vi.mock('@/api/api', () => ({
    setYearsToUser: vi.fn()
}));

describe('useYearManagement', () => {
    beforeEach(() => {
        // Clear localStorage mock
        vi.clearAllMocks();
        Object.defineProperty(window, 'localStorage', {
            value: {
                setItem: vi.fn(),
                getItem: vi.fn(),
                removeItem: vi.fn(),
            },
            writable: true,
        });
    });

    it('should initialize with default years', () => {
        const { selectedYear, years } = useYearManagement();

        expect(selectedYear.value).toBe(-1);
        expect(years).toEqual([2025]);
    });

    it('should initialize with provided years', () => {
        const initialYears = [2020, 2021, 2022];
        const { years } = useYearManagement(initialYears);

        expect(years).toEqual(initialYears);
    });

    it('should select a year', () => {
        const { selectedYear, selectYear } = useYearManagement();

        selectYear(2022);
        expect(selectedYear.value).toBe(2022);
    });

    it('should set new years', () => {
        const { years, setYears } = useYearManagement([2024]);

        setYears([2020, 2021, 2022]);
        expect(years).toEqual([2020, 2021, 2022]);
    });

    it('should add a year', async () => {
        const { setYearsToUser } = await import('@/api/api');
        const { years, addYear } = useYearManagement([2022, 2023]);
        const user = 'testuser';

        addYear(user);

        expect(years).toEqual([2022, 2023, 2021]); // Adds minYear - 1
        expect(setYearsToUser).toHaveBeenCalledWith(user, [2022, 2023, 2021]);
        expect(localStorage.setItem).toHaveBeenCalledWith('lastfm-years', JSON.stringify([2022, 2023, 2021]));
    });

    it('should not add year when no user provided', () => {
        const { years, addYear } = useYearManagement([2022, 2023]);
        const originalYears = [...years];

        addYear('');

        expect(years).toEqual(originalYears);
    });
});
