# Live View + Human in the Loop v2 Notes

This branch preserves content that was removed from the v1 PR (#29758) because the features are not yet shipped. When these features launch, merge this content back in.

## Live View additions (live-view.mdx)

### 1. Full viewing mode (table row)
Add back the "Full" row to the viewing modes table:

| Full | `https://live.browser.run/ui/view?mode=full&wss=...` | Full browser chrome with address bar and tab strip |

### 2. Inspector URL revert
Change the Inspector URL back from `mode=devtools` to the original:

| Inspector | `https://live.browser.run/ui/inspector?wss=...` | Standalone inspector view |

(Update "two viewing modes" back to "three viewing modes")

### 3. Get the Live View URL programmatically (section)
Add back the full "Get the Live View URL programmatically" section with `Cloudflare.getLiveView` CDP command for Puppeteer and Playwright. This section is already in this branch at the bottom of `live-view.mdx`.

## Human in the Loop additions (human-in-the-loop.mdx)

### 1. Cloudflare.getLiveView in HITL example
When `Cloudflare.getLiveView` ships, update the code example to use it instead of `includeTargets=true`. The original version using `Cloudflare.getLiveView` is preserved in this branch's `human-in-the-loop.mdx`.

Key change: replace the `includeTargets=true` fetch + `targets[0].devtoolsFrontendUrl` pattern with:
```js
const cdp = await page.createCDPSession();
const { devtoolsFrontendUrl: liveUrl } = await cdp.send("Cloudflare.getLiveView");
```
