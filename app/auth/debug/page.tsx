export default async function DebugPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const params = await searchParams;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Debug Auth Parameters</h1>
            <div className="bg-gray-100 p-4 rounded">
                <pre>{JSON.stringify(params, null, 2)}</pre>
            </div>
            <div className="mt-4">
                <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server side'}</p>
            </div>
        </div>
    );
}