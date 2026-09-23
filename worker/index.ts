import { WorkerEntrypoint } from "cloudflare:workers";
import { generateRedirectsEvaluator } from "redirects-in-workers";
import redirectsFileContents from "../dist/__redirects";
import { logger } from "./logger";

const redirectsEvaluator = generateRedirectsEvaluator(redirectsFileContents, {
    maxLineLength: 10_000,
    maxStaticRules: 10_000,
    maxDynamicRules: 2_000,
});

const LLMS_FULL_R2_PREFIX = "v1/cloudflare-docs-llms-full";

const API_CATALOG = JSON.stringify({
    linkset: [
        {
            anchor: "https://developers.cloudflare.com/api/",
            "service-desc": [
                {
                    href: "https://developers.cloudflare.com/openapi.json",
                    type: "application/json",
                },
            ],
            "service-doc": [
                {
                    href: "https://developers.cloudflare.com/api/index.md",
                    type: "text/markdown",
                },
                {
                    href: "https://developers.cloudflare.com/api/",
                    type: "text/html",
                },
            ],
            status: [
                {
                    href: "https://www.cloudflarestatus.com/api/v2/status.json",
                    type: "application/json",
                },
            ],
        },
    ],
});

function rewriteRedirectForMarkdown(
    redirect: Response,
    requestUrl: URL,
): Response {
    const location = redirect.headers.get("Location");
    if (!location) return redirect;

    try {
        const dest = new URL(location, requestUrl.origin);

        if (dest.origin !== requestUrl.origin) return redirect;
        if (!dest.pathname.endsWith("/")) return redirect;

        dest.pathname += "index.md";

        const headers = new Headers(redirect.headers);
        headers.set("Location", dest.pathname + dest.search + dest.hash);
        return new Response(redirect.body, {
            status: redirect.status,
            headers,
        });
    } catch {
        return redirect;
    }
}

export default class extends WorkerEntrypoint<Env> {
    override async fetch(request: Request) {
        const url = new URL(request.url);
        const { pathname } = url;
        const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

        // System Health & Monitoring Endpoint
        if (pathname === "/health") {
            logger.info("Health check probe evaluated", { requestId, service: "vane-guard-sovereign-orchestrator" });
            return new Response(
                JSON.stringify({
                    status: "ok",
                    service: "vane-guard-sovereign-orchestrator",
                    timestamp: new Date().toISOString(),
                }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                },
            );
        }

        if (pathname === "/.well-known/api-catalog") {
            return new Response(API_CATALOG, {
                headers: {
                    "Content-Type":
                        'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
                },
            });
        }

        if (pathname === "/.well-known/mcp/server-card.json") {
            const object = await this.env.MIDDLECACHE.get(
                "v1/cloudflare-mcps/server-card.json",
            );
            if (!object) {
                return new Response("server-card.json not found", { status: 404 });
            }
            return new Response(object.body, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            });
        }

        if (pathname === "/openapi.json") {
            const object = await this.env.MIDDLECACHE.get(
                "v1/cloudflare-api-schemas/openapi.json",
            );
            if (!object) {
                return new Response("openapi.json not found", { status: 404 });
            }
            return new Response(object.body, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            });
        }

        if (pathname.endsWith("/llms-full.txt")) {
            const r2Key = `${LLMS_FULL_R2_PREFIX}${pathname}`;
            const object = await this.env.MIDDLECACHE.get(r2Key);

            if (!object) {
                return new Response("llms-full.txt not found", { status: 404 });
            }

            return new Response(object.body, {
                headers: {
                    "Content-Type": "text/markdown; charset=utf-8",
                },
            });
        }

        const isMarkdownRequest = url.pathname.endsWith("/index.md");

        try {
            try {
                const evalRequest = isMarkdownRequest
                    ? new Request(
                            url.origin +
                                url.pathname.slice(0, -"index.md".length) +
                                url.search,
                            request,
                        )
                    : request;

                const redirect = await redirectsEvaluator(evalRequest, this.env.ASSETS);
                if (redirect) {
                    return isMarkdownRequest
                        ? rewriteRedirectForMarkdown(redirect, url)
                        : redirect;
                }
            } catch (error) {
                logger.error("Could not evaluate redirects", error instanceof Error ? error : new Error(String(error)), {
                    requestId,
                });
            }

            try {
                const forceTrailingSlashURL = new URL(
                    request.url.replace(/([^/])$/, "$1/"),
                    request.url,
                );
                const redirect = await redirectsEvaluator(
                    new Request(forceTrailingSlashURL, request),
                    this.env.ASSETS,
                );
                if (redirect) {
                    return isMarkdownRequest
                        ? rewriteRedirectForMarkdown(redirect, url)
                        : redirect;
                }
            } catch (error) {
                logger.error(
                    "Could not evaluate redirects with a forced trailing slash",
                    error instanceof Error ? error : new Error(String(error)),
                    {
                        requestId,
                    },
                );
            }
        } catch (error) {
            logger.error("Unknown worker error", error instanceof Error ? error : new Error(String(error)), {
                requestId,
            });
        }

        const response = await this.env.ASSETS.fetch(request);

        if (response.status === 404) {
            const section = new URL(response.url).pathname.split("/").at(1);

            if (!section) return response;

            const notFoundResponse = await this.env.ASSETS.fetch(
                `http://fakehost/${section}/404/`,
            );

            return new Response(notFoundResponse.body, {
                status: 404,
                headers: notFoundResponse.headers,
            });
        }

        return response;
    }
}
