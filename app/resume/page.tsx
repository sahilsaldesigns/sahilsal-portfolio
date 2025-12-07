import Link from "next/link";

export default function ResumePage() {
  const filePath = "/uploads/files/Sahil_Sal_Resume_2024.pdf";

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold mb-4">Resume</h1>

      <div className="mb-6">
        <a
          href={filePath}
          download
          className="inline-block bg-black text-white px-4 py-2 rounded"
        >
          Download Resume
        </a>

        <a
          href={filePath}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 text-sm text-stone-500 hover:underline"
        >
          Open in new tab
        </a>
      </div>

      <div className="border">
        <iframe
          src={filePath}
          width="100%"
          height={800}
          title="Resume"
          className="block"
        />
      </div>

      <div className="mt-6">
        <Link href="/" className="text-sm text-stone-500 hover:underline">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
