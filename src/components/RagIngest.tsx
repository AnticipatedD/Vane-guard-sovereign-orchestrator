import React, { useState } from "react";

export interface RagIngestProps {
    onIngestSuccess?: (result: any) => void;
    onIngestError?: (error: Error) => void;
}

export function RagIngest({ onIngestSuccess, onIngestError }: RagIngestProps) {
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");

    const handleIngest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const result = { success: true, timestamp: new Date().toISOString() };
            onIngestSuccess?.(result);
        } catch (err: any) {
            onIngestError?.(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rag-ingest-container">
            <h3>RAG Ingestion</h3>
            <form onSubmit={handleIngest}>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text or document reference to ingest..."
                    rows={4}
                />
                <button type="submit" disabled={loading || !input.trim()}>
                    {loading ? "Ingesting..." : "Ingest Document"}
                </button>
            </form>
        </div>
    );
}

export default RagIngest;
