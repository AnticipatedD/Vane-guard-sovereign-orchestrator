import { vi, beforeEach } from 'vitest';

beforeEach(() => {
  // Clear environment variable states to emulate clean-clone server parameters
  vi.stubEnv('CLOUDFLARE_API_TOKEN', '');
  vi.stubEnv('ALGOLIA_API_KEY', '');
  vi.stubEnv('JIRA_AUTH_TOKEN', '');

  // Stub external API fetch calls globally to isolate network IO vectors
  vi.stubGlobal('fetch', vi.fn(() => 
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: "isolated_mock_success" }),
    })
  ));
});
