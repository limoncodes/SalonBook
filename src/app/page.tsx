import { Banner } from "@/components/home/banner";


export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
 
      <main className="flex-1">
        <Banner />
      </main>
    </div>
  );
}
