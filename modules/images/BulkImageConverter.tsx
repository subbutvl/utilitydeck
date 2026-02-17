import React, { useState, useRef } from "react";

interface QueuedImage {
  id: string;
  name: string;
  original: string;
  converted: string | null;
  status: "pending" | "processing" | "done" | "error";
  targetFormat: string;
}

export const BulkImageConverter: React.FC = () => {
  const [queue, setQueue] = useState<QueuedImage[]>([]);
  const [globalFormat, setGlobalFormat] = useState("image/png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems: QueuedImage[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      original: URL.createObjectURL(file),
      converted: null,
      status: "pending",
      targetFormat: globalFormat
    }));
    setQueue([...queue, ...newItems]);
  };

  const convertOne = async (id: string) => {
    const item = queue.find((q) => q.id === id);
    if (!item) return;

    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "processing" } : q))
    );

    try {
      const img = new Image();
      img.src = item.original;
      await new Promise((r) => (img.onload = r));

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      const result = canvas.toDataURL(globalFormat, 0.9);
      setQueue((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, converted: result, status: "done" } : q
        )
      );
    } catch (err) {
      setQueue((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: "error" } : q))
      );
    }
  };

  const convertAll = async () => {
    for (const item of queue) {
      if (item.status === "pending") {
        await convertOne(item.id);
      }
    }
  };

  const downloadOne = (item: QueuedImage) => {
    if (!item.converted) return;
    const link = document.createElement("a");
    const ext = globalFormat.split("/")[1];
    link.download = `converted-${item.name.split(".")[0]}.${ext}`;
    link.href = item.converted;
    link.click();
  };

  const resetAll = () => {
    queue.forEach((q) => URL.revokeObjectURL(q.original));
    setQueue([]);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 flex-1 w-full">
          <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-[0.2em]">
            Target Format
          </label>
          <div className="flex gap-2">
            {["image/png", "image/jpeg", "image/webp"].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setGlobalFormat(fmt)}
                className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest border transition-all ${globalFormat === fmt ? "bg-white text-black border-white" : "bg-[var(--bg-input)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border)]"}`}
              >
                {fmt.split("/")[1]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 md:flex-none px-8 py-3 bg-[var(--bg-card)] border border-[var(--border)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] hover:text-[var(--text-primary)] transition-all"
          >
            + Add Images
          </button>
          <button
            onClick={convertAll}
            disabled={queue.length === 0}
            className="flex-1 md:flex-none px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-30"
          >
            Convert All
          </button>
          <button
            onClick={resetAll}
            className="px-4 py-3 border border-[var(--border)] text-[var(--text-muted)] hover:text-red-500 text-[10px] uppercase tracking-widest font-bold transition-all"
          >
            Reset
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          multiple
          accept="image/*"
        />
      </div>

      <div className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] overflow-y-auto">
        {queue.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-[var(--bg-input)] sticky top-0 z-10 border-b border-[var(--border)]">
              <tr className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">
                <th className="p-4">Original</th>
                <th className="p-4">Filename</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/50">
              {queue.map((q) => (
                <tr
                  key={q.id}
                  className="group hover:bg-[var(--bg-input)]/40 transition-colors"
                >
                  <td className="p-4">
                    <img
                      src={q.original}
                      className="w-12 h-12 object-cover border border-[var(--border)] shadow-xl"
                      alt="Preview"
                    />
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-mono text-[var(--text-primary)]">
                      {q.name}
                    </div>
                    <div className="text-[9px] text-[var(--text-muted)] uppercase font-bold mt-1">
                      Target: {globalFormat.split("/")[1]}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm border ${
                        q.status === "done"
                          ? "border-green-500/20 text-green-500 bg-green-500/5"
                          : q.status === "processing"
                            ? "border-blue-500/20 text-blue-500 bg-blue-500/5"
                            : "border-[var(--border)] text-[var(--text-muted)]"
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {q.status === "done" && (
                      <button
                        onClick={() => downloadOne(q)}
                        className="px-4 py-1.5 border border-[var(--border)] text-[10px] uppercase font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all"
                      >
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-10 uppercase tracking-[0.5em] text-center p-20">
            <div className="text-2xl font-light mb-4">
              Batch Processing Queue
            </div>
            <p className="text-[10px] font-bold">
              Local, in-browser conversion engine active
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
