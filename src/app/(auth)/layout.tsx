export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#eef5f9] flex items-center justify-center p-4 font-body">
      {children}
    </div>
  );
}
