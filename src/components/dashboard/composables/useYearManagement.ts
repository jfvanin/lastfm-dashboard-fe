import { ref, reactive } from 'vue';
import { setYearsToUser } from '@/api/api';

export function useYearManagement(initialYears: number[] = [2025]) {
    const selectedYear = ref(-1);
    const years = reactive([...initialYears]);

    const addYear = (user: string) => {
        if (!user) return;

        const minYear = Math.min(...years);
        years.push(minYear - 1);
        setYearsToUser(user, years);
        localStorage.setItem('lastfm-years', JSON.stringify(years));
    };

    const setYears = (newYears: number[]) => {
        years.splice(0, years.length, ...newYears);
    };

    const selectYear = (year: number) => {
        selectedYear.value = year;
    };

    return {
        selectedYear,
        years,
        addYear,
        setYears,
        selectYear
    };
}
