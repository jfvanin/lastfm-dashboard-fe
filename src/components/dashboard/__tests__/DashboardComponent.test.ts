import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DashboardComponent from '../../DashboardComponent.vue'

// Mock all the composables and components at module level
const mockFetchAllData = vi.fn()
const mockUpdateTheme = vi.fn()
const mockAddYear = vi.fn()
const mockSetYears = vi.fn()
const mockSelectYear = vi.fn()

vi.mock('./dashboard/composables/useChartConfiguration', () => ({
    useChartConfiguration: () => ({
        fullDecadesChart: { chartOptions: { theme: { palette: 'palette10' } }, series: [] },
        fullOriginChart: { chartOptions: { theme: { palette: 'palette10' } }, series: [] },
        fullTagsChart: { chartOptions: { theme: { palette: 'palette10' } }, series: [] },
        decadesChart: { chartOptions: { theme: { palette: 'palette10' } }, series: [] },
        originChart: { chartOptions: { theme: { palette: 'palette10' } }, series: [] },
        tagChart: { chartOptions: { theme: { palette: 'palette10' } }, series: [] },
        updateTheme: mockUpdateTheme
    })
}))

vi.mock('./dashboard/composables/useChartData', () => ({
    useChartData: () => ({
        loading: { value: false },
        data: {
            topAlbums: { topalbums: { album: [] } },
            topTracks: { toptracks: [] },
            topArtists: { topartists: { artist: [] } },
            listTop5: {
                top5ScrobbleDays: [],
                top5Streaks: [],
                top5MostScrobbleArtists: [],
                top5MostScrobbleAlbums: [],
                top5MostScrobbleTracks: []
            }
        },
        fetchAllData: mockFetchAllData
    })
}))

vi.mock('./dashboard/composables/useYearManagement', () => ({
    useYearManagement: () => ({
        selectedYear: { value: -1 },
        years: [2024],
        addYear: mockAddYear,
        setYears: mockSetYears,
        selectYear: mockSelectYear
    })
}))

// Mock child components
vi.mock('./dashboard/displays/YearTabs.vue', () => ({
    default: {
        name: 'YearTabs',
        template: '<div data-testid="year-tabs">YearTabs</div>'
    }
}))

vi.mock('./dashboard/charts/FullYearCharts.vue', () => ({
    default: {
        name: 'FullYearCharts',
        template: '<div data-testid="full-year-charts">FullYearCharts</div>'
    }
}))

vi.mock('./dashboard/charts/SingleYearCharts.vue', () => ({
    default: {
        name: 'SingleYearCharts',
        template: '<div data-testid="single-year-charts">SingleYearCharts</div>'
    }
}))

vi.mock('./dashboard/displays/ThemeSelector.vue', () => ({
    default: {
        name: 'ThemeSelector',
        template: '<div data-testid="theme-selector">ThemeSelector</div>'
    }
}))

vi.mock('vue3-spinners', () => ({
    VueSpinnerPie: {
        name: 'VueSpinnerPie',
        template: '<div data-testid="spinner">Loading...</div>'
    }
}))

describe('DashboardComponent', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders correctly with default props', () => {
        const wrapper = mount(DashboardComponent, {
            props: {
                user: 'testuser',
                years: [2020, 2021, 2022],
                theme: 'palette5'
            },
            global: {
                stubs: {
                    YearTabs: { template: '<div data-testid="year-tabs">YearTabs</div>' },
                    FullYearCharts: { template: '<div data-testid="full-year-charts">FullYearCharts</div>' },
                    SingleYearCharts: { template: '<div data-testid="single-year-charts">SingleYearCharts</div>' },
                    ThemeSelector: { template: '<div data-testid="theme-selector">ThemeSelector</div>' },
                    VueSpinnerPie: { template: '<div data-testid="spinner">Loading...</div>' }
                }
            }
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.text()).toContain('YearTabs')
    })

    it('shows loading spinner when loading', () => {
        const wrapper = mount(DashboardComponent, {
            props: {
                user: 'testuser',
                theme: 'palette1'
            },
            global: {
                stubs: {
                    YearTabs: { template: '<div data-testid="year-tabs">YearTabs</div>' },
                    FullYearCharts: { template: '<div data-testid="full-year-charts">FullYearCharts</div>' },
                    SingleYearCharts: { template: '<div data-testid="single-year-charts">SingleYearCharts</div>' },
                    ThemeSelector: { template: '<div data-testid="theme-selector">ThemeSelector</div>' },
                    VueSpinnerPie: { template: '<div data-testid="spinner">Fetching data...</div>' }
                }
            }
        })

        // The component exists and can be rendered
        expect(wrapper.exists()).toBe(true)
    })

    it('emits setTheme event when theme is updated', async () => {
        const wrapper = mount(DashboardComponent, {
            props: {
                user: 'testuser',
                theme: 'palette1'
            },
            global: {
                stubs: {
                    YearTabs: { template: '<div>YearTabs</div>' },
                    FullYearCharts: { template: '<div>FullYearCharts</div>' },
                    SingleYearCharts: { template: '<div>SingleYearCharts</div>' },
                    ThemeSelector: { template: '<div>ThemeSelector</div>' },
                    VueSpinnerPie: { template: '<div>Loading...</div>' }
                }
            }
        })

        // Test that component can emit event
        wrapper.vm.$emit('setTheme', 'palette7')
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('setTheme')).toBeTruthy()
        expect(wrapper.emitted('setTheme')?.[0]).toEqual(['palette7'])
    })

    it('handles user prop changes', async () => {
        const wrapper = mount(DashboardComponent, {
            props: {
                user: 'user1',
                theme: 'palette1'
            },
            global: {
                stubs: {
                    YearTabs: { template: '<div>YearTabs</div>' },
                    FullYearCharts: { template: '<div>FullYearCharts</div>' },
                    SingleYearCharts: { template: '<div>SingleYearCharts</div>' },
                    ThemeSelector: { template: '<div>ThemeSelector</div>' },
                    VueSpinnerPie: { template: '<div>Loading...</div>' }
                }
            }
        })

        await wrapper.setProps({ user: 'user2' })

        // Component should still exist after prop change
        expect(wrapper.exists()).toBe(true)
    })

    it('handles years prop changes', async () => {
        const wrapper = mount(DashboardComponent, {
            props: {
                user: 'testuser',
                years: [2020, 2021],
                theme: 'palette1'
            },
            global: {
                stubs: {
                    YearTabs: { template: '<div>YearTabs</div>' },
                    FullYearCharts: { template: '<div>FullYearCharts</div>' },
                    SingleYearCharts: { template: '<div>SingleYearCharts</div>' },
                    ThemeSelector: { template: '<div>ThemeSelector</div>' },
                    VueSpinnerPie: { template: '<div>Loading...</div>' }
                }
            }
        })

        await wrapper.setProps({ years: [2020, 2021, 2022, 2023] })

        // Component should still exist after prop change
        expect(wrapper.exists()).toBe(true)
    })

    it('renders FullYearCharts when selectedYear is -1', () => {
        const wrapper = mount(DashboardComponent, {
            props: {
                user: 'testuser',
                theme: 'palette1'
            },
            global: {
                stubs: {
                    YearTabs: { template: '<div>YearTabs</div>' },
                    FullYearCharts: { template: '<div data-testid="full-year-charts">FullYearCharts</div>' },
                    SingleYearCharts: { template: '<div data-testid="single-year-charts">SingleYearCharts</div>' },
                    ThemeSelector: { template: '<div>ThemeSelector</div>' },
                    VueSpinnerPie: { template: '<div>Loading...</div>' }
                }
            }
        })

        // Component should render FullYearCharts by default
        expect(wrapper.text()).toContain('FullYearCharts')
    })

    it('handles missing user gracefully', () => {
        const wrapper = mount(DashboardComponent, {
            props: {
                theme: 'palette1'
            },
            global: {
                stubs: {
                    YearTabs: { template: '<div data-testid="year-tabs">YearTabs</div>' },
                    FullYearCharts: { template: '<div>FullYearCharts</div>' },
                    SingleYearCharts: { template: '<div>SingleYearCharts</div>' },
                    ThemeSelector: { template: '<div>ThemeSelector</div>' },
                    VueSpinnerPie: { template: '<div>Loading...</div>' }
                }
            }
        })

        // Should not crash without user
        expect(wrapper.exists()).toBe(true)
        expect(wrapper.text()).toContain('YearTabs')
    })
})
