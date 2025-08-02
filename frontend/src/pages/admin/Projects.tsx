import AdminProjectsOverview from "@/components/admin/AdminProjectsOverview";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const AdminProjects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <AdminProjectsOverview />
      </div>
      <Footer />
    </div>
  );
};

export default AdminProjects;