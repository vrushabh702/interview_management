import CompanyTable from '../components/CompanyTable';

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-6">Company Job Tracker</h1>
      <CompanyTable />
    </div>
  );
}