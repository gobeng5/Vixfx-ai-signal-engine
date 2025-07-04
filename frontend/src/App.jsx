import SignalForm from './components/SignalForm';

export default function App() {
  console.log('✅ App loaded');

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SignalForm />
    </div>
  );
}
