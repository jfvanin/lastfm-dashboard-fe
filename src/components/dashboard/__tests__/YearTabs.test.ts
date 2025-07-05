import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import YearTabs from '../displays/YearTabs.vue';

describe('YearTabs', () => {
    const defaultProps = {
        selectedYear: -1,
        years: [2020, 2021, 2022, 2023]
    };

    it('renders all year buttons correctly', () => {
        const wrapper = mount(YearTabs, {
            props: defaultProps
        });

        // Should have "All years" button plus 4 year buttons plus "+" button
        const buttons = wrapper.findAll('button');
        expect(buttons).toHaveLength(6);

        // Check "All years" button
        expect(buttons[0].text()).toBe('All years');
        expect(buttons[0].classes()).toContain('active-tab');

        // Check year buttons
        expect(buttons[1].text()).toBe('2020');
        expect(buttons[2].text()).toBe('2021');
        expect(buttons[3].text()).toBe('2022');
        expect(buttons[4].text()).toBe('2023');

        // Check add button
        expect(buttons[5].text()).toBe('+');
    });

    it('shows correct active tab', () => {
        const wrapper = mount(YearTabs, {
            props: {
                ...defaultProps,
                selectedYear: 2021
            }
        });

        const buttons = wrapper.findAll('button');

        // "All years" should not be active
        expect(buttons[0].classes()).not.toContain('active-tab');

        // 2021 button should be active
        expect(buttons[2].classes()).toContain('active-tab');
    });

    it('emits selectYear event when year button is clicked', async () => {
        const wrapper = mount(YearTabs, {
            props: defaultProps
        });

        const yearButton = wrapper.findAll('button')[2]; // 2021 button
        await yearButton.trigger('click');

        expect(wrapper.emitted('selectYear')).toBeTruthy();
        expect(wrapper.emitted('selectYear')?.[0]).toEqual([2021]);
    });

    it('emits selectYear event with -1 when "All years" is clicked', async () => {
        const wrapper = mount(YearTabs, {
            props: defaultProps
        });

        const allYearsButton = wrapper.findAll('button')[0];
        await allYearsButton.trigger('click');

        expect(wrapper.emitted('selectYear')).toBeTruthy();
        expect(wrapper.emitted('selectYear')?.[0]).toEqual([-1]);
    });

    it('emits addYear event when + button is clicked', async () => {
        const wrapper = mount(YearTabs, {
            props: defaultProps
        });

        const addButton = wrapper.findAll('button')[5]; // + button
        await addButton.trigger('click');

        expect(wrapper.emitted('addYear')).toBeTruthy();
        expect(wrapper.emitted('addYear')?.[0]).toEqual([]);
    });

    it('handles empty years array', () => {
        const wrapper = mount(YearTabs, {
            props: {
                selectedYear: -1,
                years: []
            }
        });

        const buttons = wrapper.findAll('button');
        expect(buttons).toHaveLength(2); // Only "All years" and "+" buttons
    });
});
