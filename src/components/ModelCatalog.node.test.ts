import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { FilterDropdown } from './ModelCatalog'; // Adjust path if necessary based on your structure

describe('ModelCatalog FilterDropdown', () => {
    it('renders with empty items list', () => {
        const items: string[] = [];
        const selected: string[] = [];
        const label = 'Authors';
        const onChange = vi.fn();

        const { container } = render(
            <FilterDropdown
                label={label}
                items={items}
                selected={selected}
                onChange={onChange}
            />
        );
        expect(container).toBeTruthy();
    });

    it('accepts multiple selected values', () => {
        const items = ['embedding', 'chat', 'completion'];
        const selected = ['embedding'];
        const label = 'Capabilities';
        const onChange = vi.fn();

        const { container } = render(
            <FilterDropdown
                label={label}
                items={items}
                selected={selected}
                onChange={onChange}
            />
        );
        expect(container).toBeTruthy();
    });
});
