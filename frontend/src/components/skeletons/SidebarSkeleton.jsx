import { Users } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";

const SidebarSkeleton = () => {
  const { selectedUser } = useChatStore();

  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className={`
        h-full border-r border-base-300 flex flex-col transition-all duration-200
        w-full sm:w-20 lg:w-72
        ${selectedUser ? "hidden sm:flex" : "flex"}
      `}
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input type="checkbox" className="checkbox checkbox-sm" />
            <span className="text-sm">Loading...</span>
          </label>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-2">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="relative">
              <div className="skeleton size-11 sm:size-12 rounded-full bg-gray-300" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2 bg-gray-300" />
              <div className="skeleton h-3 w-16 bg-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
