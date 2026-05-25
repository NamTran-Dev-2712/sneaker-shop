import { Settings } from "lucide-react";
import ProfileIndex from "~/components/feature/user/profile/profile.index";

const AdminSettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold">Cài đặt</h1>
      </div>
      <ProfileIndex />
    </div>
  );
};

export default AdminSettingsPage;
