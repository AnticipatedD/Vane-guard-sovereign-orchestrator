import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import React from 'react';
import ResourcesBySelector from './ResourcesBySelector';

describe('ResourcesBySelector Filtering Logic', () => {
  const mockResources = [
    { id: '1', title: 'Astro Integration Guide', category: 'guides' },
    { id: '2', title: 'React State Management', category: 'tutorials' },
    { id: '3', title: 'Cloudflare Workers Setup', category: 'guides' },
  ];

  const mockFacets = ['guides', 'tutorials'];

  it('renders all resources when no active filter is selected', () => {
    render(
      React.createElement(ResourcesBySelector, {
        resources: mockResources,
        facets: mockFacets,
        activeFacet: null,
      })
    );

    expect(screen.getByText('Astro Integration Guide')).toBeInTheDocument();
    expect(screen.getByText('React State Management')).toBeInTheDocument();
    expect(screen.getByText('Cloudflare Workers Setup')).toBeInTheDocument();
  });

  it('filters visible resources correctly based on the active facet prop', () => {
    render(
      React.createElement(ResourcesBySelector, {
        resources: mockResources,
        facets: mockFacets,
        activeFacet: 'guides',
      })
    );

    expect(screen.getByText('Astro Integration Guide')).toBeInTheDocument();
    expect(screen.getByText('Cloudflare Workers Setup')).toBeInTheDocument();
    expect(screen.queryByText('React State Management')).not.toBeInTheDocument();
  });
});
