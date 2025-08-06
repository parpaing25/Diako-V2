import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Feed from "@/components/Feed";
import RightSidebar from "@/components/RightSidebar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 lg:ml-[var(--sidebar-width)] xl:mr-80 pt-[var(--header-height)]">
          <div className="p-6">
            <Feed />
          </div>
        </main>
        
        <RightSidebar />
      </div>
    </div>
  );
};

export default Index;
