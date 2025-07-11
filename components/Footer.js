export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Job Tracker. All rights reserved.</p>
      </div>
    </footer>
  );
}