import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { RagIngest } from "./RagIngest";

describe("RagIngest Component", () => {
    it("renders input textarea and submit button", () => {
        render(<RagIngest />);
        expect(screen.getByPlaceholderText(/enter text or document reference/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /ingest document/i })).toBeInTheDocument();
    });

    it("disables submit button when input is empty", () => {
        render(<RagIngest />);
        const button = screen.getByRole("button", { name: /ingest document/i });
        expect(button).toBeDisabled();
    });

    it("calls onIngestSuccess when ingestion completes successfully", async () => {
        const handleSuccess = vi.fn();
        render(<RagIngest onIngestSuccess={handleSuccess} />);

        const textarea = screen.getByPlaceholderText(/enter text or document reference/i);
        fireEvent.change(textarea, { target: { value: "Test document content" } });

        const button = screen.getByRole("button", { name: /ingest document/i });
        expect(button).not.toBeDisabled();

        fireEvent.click(button);
        expect(screen.getByRole("button", { name: /ingesting.../i })).toBeInTheDocument();

        await waitFor(() => {
            expect(handleSuccess).toHaveBeenCalledTimes(1);
            expect(handleSuccess).toHaveBeenCalledWith(
                expect.objectContaining({ success: true })
            );
        });
    });
});
