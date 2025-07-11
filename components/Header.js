import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Job Tracker</h1>
        <nav>
          <Link href="/" className="mr-4 hover:text-blue-300">Home</Link>
          <Link href="/about" className="hover:text-blue-300">About</Link>
        </nav>
      </div>
    </header>
  );
}